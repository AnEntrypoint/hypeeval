
const runwebhook = async (inp) => {
    
    const {url, body} = inp;
    console.log({inp, url, body})
    
    const result = await fetch(url,{
        headers: { "Content-Type": "application/json" },
        method: inp.method || "POST",
        body: JSON.stringify(body)
    })
    const text = await result.text()
    let json
    try {
        json = await result.json()
    } catch (e) {
        
    }
    const outp = { ...inp, text, json }
    console.log(outp, result, text, json)
    return outp;
}
export default runwebhook