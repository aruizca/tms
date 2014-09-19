#!/bin/bash
# SMMS Start-Up

#sudo -i
NODEJS_HOME="/home/cgretton/.nvm/v0.11.13"
PATH=$PATH:$NODEJS_HOME/bin
export PATH
PORT=80
export PORT

case $1 in
start)
	cd /home/cgretton/smms
	rm stop_running
	while true ; do 
	    if  [ $(ps xg | grep smms | grep -v "sh" | wc -l | awk '{print $1}') -eq 1 ] ; then
		if [ -a stop_running ] ; then 
		    echo "I have been told to stop, so I am stopping..."
		    break;
		else
		    echo "Starting node"
		    node ./bin/www > /home/cgretton/smms.log
		    X=`ps xg | grep smms | grep -v "sh" | awk '{print $1}'`
		    echo "We have a process running node : $X"
		fi
	    fi 

	    sleep 10
	done
	
;;
stop)
	echo "Asking smms server process to terminate."
	cd /home/cgretton/smms
	touch stop_running
	killall smms
;;
restart)
	echo "Killing node smms server... it should restart."
	killall smms
;;
esac
exit 0
