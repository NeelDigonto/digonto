module "dev-ecr-repo" {
  source            = "./modules/ecr"
  ecr_name          = [ "digonto/web", "digonto/gateway" ]
  tags              = {
                        "environment" = "dev"
                      }
  image_mutability  = "IMMUTABLE"

}