Sys.setenv(DISPLAY = ":55.0")
library("gplots")

library(bigmemory)
library("fastcluster")
library("rjson")
username = GET[["user"]]
filename = GET[["matrixUrl"]]
server_path <- "/var/www/HM_S"
data_dir_path <- paste(server_path, "/data/", sep = "")
filepath <- paste(data_dir_path, filename,sep="")
cluster_matrix_file <- paste(data_dir_path,"cluster_",filename,sep = "");
test <- read.table(filepath)
test_matrix <- data.matrix(test)
#test_matrix<-test_matrix[1:50,1:80]
num_r = nrow(test_matrix)
num_c = ncol(test_matrix)
tt = c(num_r,num_c)

##
# default size is 2x2 for each grid
nowtime <- as.integer(Sys.time())
h = 2 * num_r
w = 2 * num_c
tfn_r <- paste(data_dir_path, nowtime, "_r.png", sep = "")
png(filename = tfn_r,width = w,height = h)
#png(filename = tfn_r,width=100,height=160)

##
#get the map
t = heatmap.2(test_matrix, col=redgreen(75), scale="row", key=FALSE,keysize=0.00001,dendrogram="none",symkey=FALSE, Rowv=TRUE,Colv=TRUE,distfun = dist ,hclustfun =fastcluster::hclust,density.info="none",trace="none",cexRow=1.0,margins=c(0,0))
dev.off()

##
# for small files grid size is 16x16
if(tt[which.max(tt)] < 300)
{
    h = 16 * num_r
    w = 16 * num_c
}

##
#get the map
tfn_l <- paste(data_dir_path, nowtime, "_l.png", sep = "")
png(filename = tfn_l, width = w, height = h)
t = heatmap.2(test_matrix, col=redgreen(75), scale="row", key=FALSE,keysize=0.00001,dendrogram="none",symkey=FALSE, Rowv=TRUE,Colv=TRUE,distfun = dist ,hclustfun =fastcluster::hclust,density.info="none",trace="none",cexRow=1.0,margins=c(0,0))
dev.off()
##

##
#write the clustered matrix with color-score to txt

#transverse
cluster_matrix <- t(t$carpet)
#reverse by rows
rotate <- function(x) apply(x, 2 ,rev)
cluster_matrix <- rotate(cluster_matrix)
write.table(cluster_matrix, file = cluster_matrix_file, col.names=T, row.names=T, quote = T, sep = "\t")
#return the json data

ret_data <- list(image_path = tfn_l,
                 row_names = rownames(cluster_matrix),
                 col_names = colnames(cluster_matrix))

#cat(toJSON(ret_data))

if(!is.null(GET[['callback']])){
    cat(paste(GET[["callback"]], "(", toJSON(ret_data), ");", sep = ""))
}else{
    cat(toJSON(ret_data))
}
