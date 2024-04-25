resource "aws_security_group" "digonto-ec2" {
  name        = "digonto-ec2"
  description = "Security group for digonto ec2 instance"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name = "digonto-ec2"
  }
}

# TCP
resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}





# UDP
resource "aws_vpc_security_group_ingress_rule" "allow_http_udp_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "udp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_udp_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  from_port         = 80
  ip_protocol       = "udp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_udp_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "udp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_udp_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  from_port         = 443
  ip_protocol       = "udp"
  to_port           = 443
}




# SSH
resource "aws_vpc_security_group_ingress_rule" "allow_ssh_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}



# Egress
resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv6" {
  security_group_id = aws_security_group.digonto-ec2.id
  cidr_ipv6         = "::/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}
