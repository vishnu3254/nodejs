console.log('start')
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success');
    }, 2000)
})
console.log('middle')
promise.then((res) => {
    console.log(res);
})
console.log('end')
