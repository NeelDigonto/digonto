data "aws_availability_zones" "available" {}

locals {
  region       = "ap-south-1"
  cluster_name = "digonto"
  tags         = {}
  azs          = slice(data.aws_availability_zones.available.names, 0, 3)
}

# output "configure_kubectl" {
#   description = "Configure kubectl: make sure you're logged in with the correct AWS profile and run the following command to update your kubeconfig"
#   value       = "aws eks --region ${local.region} update-kubeconfig --name ${module.eks.cluster_name}"
# }
