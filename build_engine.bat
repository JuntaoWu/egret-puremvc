@echo off
if exist error.txt  del error.txt /f /q
echo 正在编译项目和引擎...[完成后自动关闭本窗口,若发错误,日志将输出到error.txt内]
call egret upgrade
call egret build -e -log -v