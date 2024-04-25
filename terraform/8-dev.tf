module "dev-ecr-repo" {
  source   = "./modules/ecr"
  ecr_name = ["digonto/web", "digonto/gateway"]
  tags = {
    Name = "digonto-ecr"
  }
  image_mutability = "IMMUTABLE"
}
