@echo off
if exist error.txt  del error.txt /f /q
echo ���ڱ�����Ŀ������...[��ɺ��Զ��رձ�����,��������,��־�������error.txt��]
call egret upgrade
call egret build -e -log -v