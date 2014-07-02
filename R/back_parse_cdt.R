
library("rjson")
username = GET[["user"]]
filename = GET[["matrixName"]]
server_path <- "/var/www/HM_S"
data_dir_path <- paste(server_path, "/data/", sep = "")
filepath <- paste(data_dir_path, filename ,".cdt", sep = "")

data.mat <- read.table(filepath , header=F, skip=3)
col.vec <- scan(filepath , what=character(), nline=1)
gweight.ind <- which(col.vec == "GWEIGHT")
col.vec <- col.vec[(gweight.ind+1):length(col.vec)]
rownames(data.mat) <- data.mat[,2]
data.mat <- data.mat[, (gweight.ind+1):ncol(data.mat)]
colnames(data.mat) <- col.vec
new_filename <- paste(data_dir_path, filename ,".txt", sep = "")
write.table(data.mat, row.names=T, col.names=T, file=new_filename)

#if(!is.null(GET[['callback']])){
#    cat(paste(GET[["callback"]], "(", toJSON(ret_data), ");", sep = ""))
#}else{
#    cat(toJSON(ret_data))
#}
