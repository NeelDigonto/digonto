resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.this.id
  }

  tags = {
    Name = "digonto-rt-public"
  }
}

# resource "aws_route_table" "private" {
#   vpc_id = aws_vpc.this.id
# 
#   route {
#     cidr_block     = "0.0.0.0/0"
#     nat_gateway_id = aws_nat_gateway.public2-ap-south-1b.id
#   }
# 
#   tags = {
#     Name = "digonto-rt-private"
#   }
# 
# }

#----------------------------------------------------------------------------------
# ap-south-1a
resource "aws_route_table_association" "public1-ap-south-1a" {
  subnet_id      = aws_subnet.public1-ap-south-1a.id
  route_table_id = aws_route_table.public.id
}

#resource "aws_route_table_association" "private1-ap-south-1a" {
#  subnet_id      = aws_subnet.private1-ap-south-1a.id
#  route_table_id = aws_route_table.private.id
#}
#----------------------------------------------------------------------------------

#----------------------------------------------------------------------------------
# ap-south-1b
resource "aws_route_table_association" "public2-ap-south-1b" {
  subnet_id      = aws_subnet.public2-ap-south-1b.id
  route_table_id = aws_route_table.public.id
}

#resource "aws_route_table_association" "private2-ap-south-1b" {
#  subnet_id      = aws_subnet.private2-ap-south-1b.id
#  route_table_id = aws_route_table.private.id
#}
#----------------------------------------------------------------------------------

#----------------------------------------------------------------------------------
# ap-south-1c
resource "aws_route_table_association" "public3-ap-south-1c" {
  subnet_id      = aws_subnet.public3-ap-south-1c.id
  route_table_id = aws_route_table.public.id
}

#resource "aws_route_table_association" "private3-ap-south-1c" {
#  subnet_id      = aws_subnet.private3-ap-south-1c.id
#  route_table_id = aws_route_table.private.id
#}
#----------------------------------------------------------------------------------
