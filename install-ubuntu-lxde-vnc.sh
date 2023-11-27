#!/bin/bash

# Atualizar pacotes do Termux
pkg update && pkg upgrade

# Instalar pacotes necessários
pkg install wget proot -y

# Criar uma nova pasta para o Ubuntu
mkdir -p ~/ubuntu
cd ~/ubuntu

# Baixar o script de instalação do Ubuntu
wget https://raw.githubusercontent.com/Neo-Oli/termux-ubuntu/master/ubuntu.sh

# Tornar o script executável
chmod +x ubuntu.sh

# Executar o script de instalação
./ubuntu.sh

# Entrar no Ubuntu
./start-ubuntu.sh

# Dentro do ambiente Ubuntu, instalar LXDE e o servidor VNC
apt update
apt install lxde tightvncserver -y

# Configurando o servidor VNC
vncserver :1
# Será solicitado a definir uma senha de acesso

# Iniciar a sessão LXDE no VNC
echo "lxsession &" > ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup
vncserver -kill :1
vncserver :1

# Instruções para conectar-se via VNC
echo "Para se conectar a este servidor VNC, use o endereço IP do dispositivo com a porta 5901 (ex: 192.168.1.123:5901)"
echo "Utilize um cliente VNC em seu computador para se conectar."
