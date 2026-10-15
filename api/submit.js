"use strict";


/*
============================================================
WORK WAYS USA
WHATSAPP CLOUD API VERCEL FUNCTION
============================================================
*/


const GRAPH_API_VERSION =
    process.env.WHATSAPP_GRAPH_API_VERSION ||
    "v23.0";


const ACCESS_TOKEN =
    process.env.WHATSAPP_ACCESS_TOKEN;


const PHONE_NUMBER_ID =
    process.env.WHATSAPP_PHONE_NUMBER_ID;


const RECIPIENT_PHONE =
    process.env.WHATSAPP_RECIPIENT_PHONE;


/*
============================================================
HELPER
============================================================
*/

function clean(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "Not provided";

    }

    return String(value).trim();

}


/*
============================================================
DATE FORMAT
============================================================
*/

function formatDate(value) {

    if (!value) {

        return "Not provided";

    }

    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "en-GB",
        {

            day: "2-digit",

            month: "long",

            year: "numeric"

        }
    );

}


/*
============================================================
CREATE WHATSAPP MESSAGE
============================================================
*/

function createMessage(data) {

    return (

`*WORK WAYS USA — NEW APPLICATION*

━━━━━━━━━━━━━━━━━━━━
*APPLICATION REFERENCE*
━━━━━━━━━━━━━━━━━━━━

Reference:
*${clean(data.reference)}*

━━━━━━━━━━━━━━━━━━━━
*PERSONAL INFORMATION*
━━━━━━━━━━━━━━━━━━━━

Full Name:
${clean(data.fullName)}

Date of Birth:
${formatDate(data.dateOfBirth)}

Sex:
${clean(data.sex)}

Nationality:
${clean(data.nationality)}

Current Country:
${clean(data.currentCountry)}

Education:
${clean(data.education)}

Current Occupation:
${clean(data.occupation)}

━━━━━━━━━━━━━━━━━━━━
*EMPLOYMENT PREFERENCES*
━━━━━━━━━━━━━━━━━━━━

Job Interested In:
${clean(data.job)}

Availability:
${clean(data.availability)}

━━━━━━━━━━━━━━━━━━━━
*BACKGROUND & VISA*
━━━━━━━━━━━━━━━━━━━━

Criminal Record:
${clean(data.criminalRecord)}

Previous U.S. Visa:
${clean(data.previousVisa)}

Visa Type:
${clean(data.visaType)}

━━━━━━━━━━━━━━━━━━━━
*PASSPORT*
━━━━━━━━━━━━━━━━━━━━

Passport Number:
${clean(data.passportNumber)}

Passport Expiry:
${formatDate(data.passportExpiry)}

━━━━━━━━━━━━━━━━━━━━
*CONTACT*
━━━━━━━━━━━━━━━━━━━━

WhatsApp:
${clean(data.whatsapp)}

Email:
${clean(data.email)}

━━━━━━━━━━━━━━━━━━━━
*DOCUMENT CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━

Documents Ready:
${data.documentsReady ? "YES" : "NO"}

Information Confirmed:
${data.informationCorrect ? "YES" : "NO"}

━━━━━━━━━━━━━━━━━━━━
*APPLICATION RECEIVED*
━━━━━━━━━━━━━━━━━━━━

Reference:
*${clean(data.reference)}*

Submitted:
${new Date().toLocaleString(
    "en-GB",
    {
        timeZone: "Africa/Nairobi"
    }
)}

*END OF APPLICATION*`
    );

}


/*
============================================================
VALIDATION
============================================================
*/

function validateData(data) {

    const requiredFields = [

        "reference",

        "fullName",

        "dateOfBirth",

        "sex",

        "nationality",

        "currentCountry",

        "education",

        "occupation",

        "job",

        "availability",

        "criminalRecord",

        "previousVisa",

        "visaType",

        "passportNumber",

        "passportExpiry",

        "whatsapp"

    ];


    for (
        const field
        of requiredFields
    ) {

        if (
            !data[field] ||
            String(data[field]).trim() === ""
        ) {

            return false;

        }

    }


    if (
        data.documentsReady !== true ||
        data.informationCorrect !== true
    ) {

        return false;

    }


    return true;

}


/*
============================================================
VERCEL FUNCTION
============================================================
*/

module.exports =
async function handler(
    request,
    response
) {


    /*
    --------------------------------------------
    ONLY POST
    --------------------------------------------
    */

    if (
        request.method !== "POST"
    ) {

        return response
            .status(405)
            .json({

                success: false,

                message:
                    "Method not allowed."

            });

    }


    /*
    --------------------------------------------
    CHECK ENVIRONMENT VARIABLES
    --------------------------------------------
    */

    if (
        !ACCESS_TOKEN ||
        !PHONE_NUMBER_ID ||
        !RECIPIENT_PHONE
    ) {

        console.error(
            "WhatsApp environment variables are missing."
        );


        return response
            .status(500)
            .json({

                success: false,

                message:
                    "Server WhatsApp configuration is incomplete."

            });

    }


    /*
    --------------------------------------------
    GET REQUEST BODY
    --------------------------------------------
    */

    const data =
        request.body;


    /*
    --------------------------------------------
    VALIDATE
    --------------------------------------------
    */

    if (
        !data ||
        !validateData(data)
    ) {

        return response
            .status(400)
            .json({

                success: false,

                message:
                    "Please complete all required fields."

            });

    }


    /*
    --------------------------------------------
    CREATE MESSAGE
    --------------------------------------------
    */

    const message =
        createMessage(data);


    /*
    --------------------------------------------
    WHATSAPP CLOUD API URL
    --------------------------------------------
    */

    const url =
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;


    try {


        /*
        ----------------------------------------
        SEND TO WHATSAPP
        ----------------------------------------
        */

        const whatsappResponse =
            await fetch(
                url,
                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${ACCESS_TOKEN}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            messaging_product:
                                "whatsapp",

                            recipient_type:
                                "individual",

                            to:
                                RECIPIENT_PHONE,

                            type:
                                "text",

                            text: {

                                preview_url:
                                    false,

                                body:
                                    message

                            }

                        })

                }
            );


        const result =
            await whatsappResponse.json();


        /*
        ----------------------------------------
        WHATSAPP ERROR
        ----------------------------------------
        */

        if (
            !whatsappResponse.ok
        ) {

            console.error(
                "WhatsApp API error:",
                result
            );


            return response
                .status(502)
                .json({

                    success: false,

                    message:
                        "WhatsApp could not accept the application.",

                    details:
                        result

                });

        }


        /*
        ----------------------------------------
        SUCCESS
        ----------------------------------------
        */

        console.log(
            "Application sent:",
            data.reference
        );


        return response
            .status(200)
            .json({

                success: true,

                reference:
                    data.reference,

                message:
                    "Application successfully sent to WhatsApp."

            });


    }

    catch(error) {


        console.error(
            "WhatsApp request failed:",
            error
        );


        return response
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to contact WhatsApp."

            });

    }

};