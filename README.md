# SCF Python/Nodejs语言实时日志功能

## 说明

该模块用于实现SCF Python/Nodejs Runtime的实时日志功能，通过该组件，您可以实时查看到函数输出的日志（包括print和logging等），本组件目前在测试阶段，欢迎测试提意见，目前不建议上业务。

## 准备

* 安装`scflog`：

```text
npm install scflog
```

安装时，可能需要`root`权限，否则可能无法使用。

* 部署实时日志组件，新建项目，并且建立`serverless.yaml`，内容：

## 组件部署

```text
PythonLogs:
  component: '@gosls/tencent-pythonlogs'
  inputs:
    region: ap-guangzhou
```

这里的参数是您要将这个组件部署的区域。该组件可以复用，也就是说这个组件部署完成之后可以一直被使用。

通过`sls --debug`部署：

```text
DEBUG ─ Setting tags for function PythonRealTimeLogs_Cleanup
DEBUG ─ Creating trigger for function PythonRealTimeLogs_Cleanup
DEBUG ─ Deployed function PythonRealTimeLogs_Cleanup successful

PythonLogs: 
    websocket: ws://service-laabz6zm-1256773370.gz.apigw.tencentcs.com/test/python_real_time_logs
    
    26s › PythonLogs › done

```

此时我们需要配置组件：

```text
scflog set -w ws://service-laabz6zm-1256773370.gz.apigw.tencentcs.com/test/python_real_time_logs
```

配置成功输出：

```text
DFOUNDERLIU-MB0:~ dfounderliu$ scflog set -w ws://service-laabz6zm-1256773370.gz.apigw.tencentcs.com/test/python_real_time_logs
设置成功
	websocket: ws://service-laabz6zm-1256773370.gz.apigw.tencentcs.com/test/python_real_time_logs
	region: ap-guangzhou
	namespace: default
```


通过`sls remove --debug`移除

```text
DEBUG ─ Removing any previously deployed API. api-rzm1uzik
DEBUG ─ Removing any previously deployed API. api-07wq4u9a
DEBUG ─ Removing any previously deployed service. service-laabz6zm

6s › PythonLogs › done
```

## 项目中使用

在项目中使用该组件的方法很简单。

* 创建一个文件夹，并进入

`mkdir scflogs && cd scflogs`

* 初始化项目

`scflog init -l python`

* 创建`index.py`文件以及`serverless.yaml`文件：

```text
vim index.py
```

内容是：

```text
from logs import *
import time
import logging

def main_handler(event, context):
    print("event is: ", event)
    time.sleep(1)
    logging.debug("this is debug_msg")
    time.sleep(1)
    logging.info("this is info_msg")
    time.sleep(1)
    logging.warning("this is warning_msg")
    time.sleep(1)
    logging.error("this is error_msg")
    time.sleep(1)
    logging.critical("this is critical_msg")
    time.sleep(1)
    print("context is: ", event)
    return "hello world"

```

```text
vim serverless.yaml
```

内容是：

```text
Hello_World:
  component: "@serverless/tencent-scf"
  inputs:
    name: Hello_World
    codeUri: ./
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: My Serverless Function
    memorySize: 64
    timeout: 20
    exclude:
      - .gitignore
      - .git/**
      - node_modules/**
      - .serverless
      - .env
    events:
      - apigw:
          name: serverless
          parameters:
            protocols:
              - http
            serviceName: serverless
            description: the serverless service
            environment: release
            endpoints:
              - path: /test
                method: ANY

```

通过`sls --debug`部署：

```text
DEBUG ─ Deployed function Hello_World successful

  Hello_World: 
    Name:        Hello_World
    Runtime:     Python3.6
    Handler:     index.main_handler
    MemorySize:  64
    Timeout:     20
    Region:      ap-guangzhou
    Namespace:   default
    Description: My Serverless Function
    APIGateway: 
      - serverless - http://service-89bjzrye-1256773370.gz.apigw.tencentcs.com/release

  30s › Hello_World › done

```

此时，我们配置了APIGW的触发器，地址是上面输出的地址 + endpoints中的path例如：

```text
http://service-89bjzrye-1256773370.gz.apigw.tencentcs.com/release/test
```

此时，我们可以打开实时日志：

```text
scflog logs -n Hello_World -r ap-guangzhou
```

此时会提醒我们实时日志开启成功：

```text
DFOUNDERLIU-MB0:~ dfounderliu$ scflog logs -n Hello_World -r ap-guangzhou
实时日志开启 ... 
```

我们可以用浏览器通过刚才函数部署完成返回给我们的地址触发函数：

```text
实时日志开启 ... 
[2020-03-04 16:36:08] :  ......}
[2020-03-04 16:36:09] :  DEBUG debug_msg 
[2020-03-04 16:36:10] :  INFO info_msg 
[2020-03-04 16:36:11] :  WARNING warning_msg 
[2020-03-04 16:36:14] :  ERROR error_msg 
[2020-03-04 16:36:14] :  CRITICAL critical_msg 
[2020-03-04 16:36:16] :  context is: .......}
.......
```

至此，实现实时日志功能。
