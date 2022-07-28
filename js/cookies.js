/**
 * This function allows us get the UTC date from a number of days
 * @param {Integer} dias is the days are the days we want the cookie to last
 * @returns the date after the chosen days in UTC format
 */
const newDateUTC=dias=>{
    let date=new Date();
    date.setTime(date.getTime()+dias*1000*60*60*24);
    return date.toUTCString();
}
/**
 * 
 * @param {String} name is the cookie name
 * @param {Integer} days is the number of days the cookie will last
 */
const makeCookie = (name,days) =>{
    let expires = newDateUTC(days);
    document.cookie = `${name};expires=${expires}`;
}
/**
 * This function allows us get the value of a cookie
 * @param {String} Cname is the name of the cookie we are looking for
 * @returns the value of the cookie if exist
 */
const getCookie = Cname =>{
    let cookies = document.cookie;
    cookies = cookies.split(";");
    for(let ck of cookies){
        let cookie = ck.trim();
        if(cookie.startsWith(Cname)){
            return cookie.split("=")[1];
        }
    }
    return "don't exist cookies whit this name"
}
// this allows us show or not the cookie notice container
if(getCookie("acceptedCookies") !== "true"){
    setTimeout(()=>{
        document.querySelector("#div-cookie").style.zIndex = "10";
        document.querySelector("#div-cookie").style.opacity = "1";
        document.querySelector("#ck-yes").addEventListener("click",()=>{
            makeCookie("acceptedCookies=true",30);
            document.querySelector("#div-cookie").style.opacity = "0";
            setTimeout(()=>{
                document.querySelector("#div-cookie").style.zIndex = "-1";
            },1000);
        });
        document.querySelector("#ck-no").addEventListener("click",()=>{
            makeCookie("acceptedCookies=false",30);
            document.querySelector("#div-cookie").style.opacity = "0";
            setTimeout(()=>{
                document.querySelector("#div-cookie").style.zIndex = "-1";
            },1000);

        },200);

    })
}