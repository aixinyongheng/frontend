import nprogress from 'nprogress'
// export const client = new hprose.HttpClient(baseService) // 系统服务
//export const javaClient = new hprose.HttpClient(javaService) // 业务服务
export const hpClient = new hprose.HttpClient(baseService) // 业务服务

export const processClient=new hprose.HttpClient(processService)  

export const dbClient=new hprose.HttpClient(dbService);//数据库导出服务

export const HproseHttpClient = hprose.HttpClient;

window.HproseHttpClient = HproseHttpClient;

hpClient.use((name, args, context, next) => {
    nprogress.start() // 进度条
    let result = next(name, args, context)
    result.then(function(result) {
        nprogress.done()
        console.log("接口调用:", '---', name, '----', args, '----', JSON.parse(result))
    })
    return result
})

