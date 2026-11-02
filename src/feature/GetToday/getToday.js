export let getTodayDate=()=>{

    let today = new Date();
    today = `${today.getFullYear()}/${String(today.getMonth()).length == 1 ? "0" + today.getMonth() : today.getMonth()}/${String(today.getDay()).length == 1 ? "0" + today.getDay() : today.getDay()}`;
return today
}