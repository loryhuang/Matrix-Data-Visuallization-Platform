Sys.setenv(DISPLAY = ":55.0")
library("gplots")
library("fastcluster")

username = GET[["user"]]
filename = GET[["matrix"]]
server_path <- "/var/www/HM_S"
data_dir_path <- paste(server_path, "/data/", sep = "")
tmp_dir_path <- paste(server_path, "/tmp/", sep = "")
filepath <- paste(data_dir_path , filename , sep="")
test <- read.table(filepath)
tt <- data.matrix(test)

if(GET[["type"]] == "row"){

    y1 <- as.integer(GET[["y1"]])
    y2 <- as.integer(GET[["y2"]])
    x1 <- as.integer(GET[["x1"]])
    x2 <- as.integer(GET[["x2"]])
    x3 <- as.integer(GET[["x3"]])
    x4 <- as.integer(GET[["x4"]])

    k <- cbind(tt[y1:y2,x1:x2],tt[y1:y2,x3:x4])
    r <- abs(y1-y2) + 1
    c <- abs(x1-x2)+abs(x3-x4) + 2
}else{

    x1<-as.integer(GET[["x1"]])
    x2<-as.integer(GET[["x2"]])
    y1<-as.integer(GET[["y1"]])
    y2<-as.integer(GET[["y2"]])
    y3<-as.integer(GET[["y3"]])
    y4<-as.integer(GET[["y4"]])
    
    k <- rbind(tt[y1:y2,x1:x2],tt[y3:y4,x1:x2])
    c <- abs(x1-x2) + 1
    r <- abs(y1-y2)+abs(y3-y4) + 2
}

#r = as.integer(GET[["r2"]]) - as.integer(GET[["r1"]]) + 1
#c = as.integer(GET[["c2"]]) - as.integer(GET[["c1"]]) + 1
h = 16 * r
w = 16 * c

##
#get the map
##

#k = tt[GET[["r1"]] : GET[["r2"]], GET[["c1"]] : GET[["c2"]]]
nowtime <- as.integer(Sys.time())
tmp_image_filename <- paste(nowtime, ".png", sep = "")
tfn <- paste(tmp_dir_path, tmp_image_filename ,sep = "")
png(filename = tfn,width = w, height = h)
t = heatmap.2(k, col = redgreen(75), scale = "row", key = FALSE, keysize = 0.00001, dendrogram = "none", symkey = FALSE, Rowv = TRUE, Colv = TRUE, distfun = dist ,hclustfun =fastcluster::hclust, density.info = "none", trace = "none", cexRow = 1.0, margins = c(0,0))
dev.off()

##
#get the cluster
##
hcc = as.hclust(t$colDendrogram) 
hcc$height <- (hcc$height - min(hcc$height))/(max(hcc$height) - min(hcc$heigh)) + 0.1 
ddc <- as.dendrogram(hcc)
tmp_row_image_filename <- paste("row_", as.integer(Sys.time()),".png", sep = "")
tfn1 <- paste(tmp_dir_path, tmp_row_image_filename, sep = "")
png(filename = tfn1, height = 160, width = w)
par(mar = c(0, 0, 0, 0))
plot(ddc, axes = FALSE, xaxs = "i", leaflab = "none")
dev.off()

hcr = as.hclust(t$rowDendrogram)
hcr$height <- (hcr$height - min(hcr$height))/(max(hcr$height) - min(hcr$heigh)) + 0.1 
ddr <- as.dendrogram(hcr)
tmp_col_image_filename <- paste("col_", as.integer(Sys.time()),".png", sep = "")
tfn2 <- paste(tmp_dir_path, tmp_col_image_filename, sep = "")
png(filename = tfn2,height = h,width = 160)
par(mar = c(0, 0, 0, 0))
plot(ddr, horiz = TRUE, axes = FALSE, yaxs = "i", leaflab = "none")
dev.off()

##
#get the color key
##
par(mar = c(0, 0, 0, 0))
tmp_key_image_filename <- paste("key_", as.integer(Sys.time()), ".png", sep = "")
tfn3 <- paste(tmp_dir_path, tmp_key_image_filename, sep = "")
png(tfn3,width = 160, height = 160)
x = t$carpet
z <- seq(min(x), max(x), length = length(t$col))
image(z = matrix(z, ncol = 1), col = t$col,xaxt = "n", yaxt = "n")
par(usr = c(0, 1, 0, 1))
lv <- pretty(t$breaks)
xv <- (as.numeric(lv) - min(x))/(max(x) - min(x))
axis(1, at = xv, labels = lv)
mtext(side = 1, "Row Z-Score", line = 5)
           
title("Color Key")
dev.off()
##
#output the html
##

json_data <- list(color_key = paste("./tmp/", tmp_key_image_filename, sep = ""),
                  col_image = paste("./tmp/", tmp_col_image_filename, sep = ""),
                  row_image = paste("./tmp/", tmp_row_image_filename, sep = ""),
                  image_path = paste("./tmp/", tmp_image_filename, sep = ""),
                  row_names = rownames(t$carpet),
                  col_names = colnames(t$carpet))
                  
library(rjson)
if(!is.null(GET[['callback']])){
    cat(paste(GET[["callback"]], "(", toJSON(json_data), ");", sep = ""))
}else{
    cat(toJSON(json_data))
}
