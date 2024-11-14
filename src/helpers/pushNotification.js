




const pushNotification =async (fcm = [], title, desc)=> {


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer AAAA_sdL9eg:APA91bGcr_wcISsDQxewj3gX_E8MpVeQaUTAVlkts-or1LbtwmEkZgpui_WYR6pY-c_hE52gyf5GtWl5Z8xIIAA2FWIR1PX46H6QvMTSVSGON2CKitAlhpNZ1OVnNE7breNVd_IX8BqZ");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "registration_ids": fcm,
        "notification": {
            "title": title,
            "body": desc,
        },
        "priority": "high",
        "data": {}
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => {
            return false;
        });

    const data = await fetch('https://fcm.googleapis.com/fcm/send');

}

module.exports = {
    pushNotification
}