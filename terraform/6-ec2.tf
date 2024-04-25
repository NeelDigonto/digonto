data "aws_ami" "digonto-ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20240301"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "digonto-ec2" {
  ami           = data.aws_ami.digonto-ubuntu.id
  instance_type = "t3a.large"

  availability_zone = aws_subnet.public1-ap-south-1a.availability_zone
  subnet_id         = aws_subnet.public1-ap-south-1a.id

  # user_data
  key_name               = "digonto-ec2"
  vpc_security_group_ids = [aws_security_group.digonto-ec2.id]

  credit_specification {
    cpu_credits = "unlimited"
  }

  tags = {
    Name = "dionto-ec2"
  }

}

resource "aws_eip" "digonto-eip" {
  instance = aws_instance.digonto-ec2.id
  domain   = "vpc"

  tags = {
    Name = "dionto-ec2"
  }
}


resource "aws_ebs_volume" "digonto-ec2" {
  availability_zone = aws_subnet.public1-ap-south-1a.availability_zone # don't tie it to any ec2 attributes
  type              = "gp3"
  size              = 25
  tags = {
    Name = "digonto-ec2"
  }
}

resource "aws_volume_attachment" "digonto" {
  device_name = "/dev/sda1" # xvda
  volume_id   = aws_ebs_volume.digonto-ec2.id
  instance_id = aws_instance.digonto-ec2.id
}

