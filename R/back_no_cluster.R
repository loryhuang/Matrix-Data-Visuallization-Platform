Sys.setenv(DISPLAY = ":55.0")
library("gplots")
library("fastcluster")
library("rjson")
library(bigmemory)
options(stringsAsFactors=F)
server_path <- "/var/www/HM_S"
data_dir_path <- paste(server_path, "/data/", sep = "")
filepath <- paste(data_dir_path, filename, sep="")

test <- read.table(filepath)
test_matrix <- data.matrix(test)

nowtime <- as.integer(Sys.time())
tfn_r <- paste(data_dir_path, nowtime, "_r.png", sep = "")
#num_r = nrow(test_matrix)
#num_c = ncol(test_matrix)
#h = 2 * num_r
#w = 2 * num_c
#png("lala.png",width = w,height = h)

##heatmap with no-cluster
png(tfn_r)
t1 = heatmap.2(test_matrix, col=redgreen(75), scale="none", key=FALSE,keysize=0.00001,dendrogram="none",symkey=FALSE, Rowv=FALSE,Colv="Rowv",distfun = dist ,hclustfun =NULL,density.info="none",trace="none",cexRow=1.0,margins=c(0,0), revC=TRUE)
dev.off()
##转置后的矩阵matrix_middle（原始矩阵）
##col和row都对应着heatmap，但是，row是和heatmap里是反序的
matrix_middle <- t(t1$carpet)
col_names <- colnames(matrix_middle)
row_names <- rownames(matrix_middle)

ret_no_cluster_data <- list(image_path = tfn_r,
                 col_names <- colnames(matrix_middle),
                 row_names <- rownames(matrix_middle))