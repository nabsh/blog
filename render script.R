library(quarto)
library(babelquarto)
library(servr)
parent_dir <-"D:\\Nextcloud"
parent_dir <- "C:\\Users\\sheikhhassan\\Nextcloud"
project_dir <- "Blog"
babelquarto::render_website(file.path(parent_dir, project_dir))
servr::httw(file.path(parent_dir, project_dir, "_site"))
