#----------------------------------------------------------------------------------
# ap-south-1a
resource "aws_subnet" "public1-ap-south-1a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.0.0/19"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name" = "digonto-subnet-public1-ap-south-1a"
    # "kubernetes.io/role/elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}

resource "aws_subnet" "private1-ap-south-1a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.32.0/19"
  availability_zone = "ap-south-1a"

  tags = {
    "Name" = "digonto-subnet-private1-ap-south-1a"
    # "kubernetes.io/role/internal-elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}
#----------------------------------------------------------------------------------

#----------------------------------------------------------------------------------
# ap-south-1b
resource "aws_subnet" "public2-ap-south-1b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    "Name" = "digonto-subnet-public1-ap-south-1b"
    # "kubernetes.io/role/elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}

resource "aws_subnet" "private2-ap-south-1b" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.96.0/19"
  availability_zone = "ap-south-1b"

  tags = {
    "Name" = "digonto-subnet-private1-ap-south-1b"
    # "kubernetes.io/role/internal-elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}
#----------------------------------------------------------------------------------

#----------------------------------------------------------------------------------
# ap-south-1c
resource "aws_subnet" "public3-ap-south-1c" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.128.0/19"
  availability_zone       = "ap-south-1c"
  map_public_ip_on_launch = true

  tags = {
    "Name" = "digonto-subnet-public1-ap-south-1c"
    # "kubernetes.io/role/elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}

resource "aws_subnet" "private3-ap-south-1c" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.160.0/19"
  availability_zone = "ap-south-1c"

  tags = {
    "Name" = "digonto-subnet-private1-ap-south-1c"
    # "kubernetes.io/role/internal-elb" = "1"
    # "kubernetes.io/cluster/digonto-cluster" = "owned"
    # "karpenter.sh/discovery" = local.cluster_name
  }
}
#----------------------------------------------------------------------------------
