
#  devConfig配置参数
## publicPath
根目录的替换URl，必须和devserver设置的publicPath一致。因为内存构建文件只允许以devserver设置的publicpath开头才能访问到。

## 内存中构建文件的地址
当使用devserver在内存中构建时候，构建地址完全由
devConfig的publicPath和filename生成：publicPath/filename 
这个地址只是在内存中的，不会影响实际文件系统的同目录文件

# devserver配置参数
## contentbase参数
配置根目录到服务器的映射。
访问根目录自动映射到contentbase设置的文件夹

## publicpath参数
只有访问以publicpath开头的地址，才有可能访问到内存中构建的虚拟文件。
访问的时候，会自动替换成devConfig中设置的publicPath,然后看这个地址是否有对应的
虚拟文件，如果没有，会根据contentbase的设置找对应服务器文件是否存在。

## 注意事项
两个publicPath必须一致，否则html中引用的资源会访问不到虚拟地址。（html引用资源的开头是publicUrl，如果和devServer设置的不一致，就无法访问虚拟构建地址）

## 访问地址流程
会先检查是否以devServer的publicPath开头，如果是，把devServer的publicPath
替换成devConfig的publicPath看是否能访问到内存构建地址，如果没有，根据contentbase
映射的服务器地址能不能获取到文件。