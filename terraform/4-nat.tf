# resource "aws_eip" "nat" {
#   #domain = "vpc"
# 
#   tags = {
#     Name = "digonto-eip-nat"
#   }
# }
# 
# resource "aws_nat_gateway" "public2-ap-south-1b" {
#   allocation_id = aws_eip.nat.id
#   subnet_id     = aws_subnet.public2-ap-south-1b.id
# 
#   tags = {
#     Name = "digonto-nat-public2-ap-south-1b"
#   }
# 
#   depends_on = [aws_internet_gateway.this]
# }
