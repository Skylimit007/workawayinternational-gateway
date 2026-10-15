"use strict";


/*
============================================================
GENERATE APPLICATION REFERENCE
============================================================
*/

function generateReference() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


    return `WW-${year}${month}${day}-${random}`;

}


const applicationReference =
    generateReference();


document
    .getElementById("referenceNumber")
    .textContent =
    applicationReference;


/*
============================================================
FORM
============================================================
*/

const form =
    document.getElementById(
        "applicationForm"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


const buttonText =
    document.getElementById(
        "buttonText"
    );


const buttonLoader =
    document.getElementById(
        "buttonLoader"
    );


const statusMessage =
    document.getElementById(
        "statusMessage"
    );


/*
============================================================
GET FORM VALUES
============================================================
*/

function getFormData() {

    return {

        reference:
            applicationReference,

        fullName:
            document
                .getElementById("fullName")
                .value
                .trim(),

        dateOfBirth:
            document
                .getElementById("dateOfBirth")
                .value,

        sex:
            document
                .getElementById("sex")
                .value,

        nationality:
            document
                .getElementById("nationality")
                .value,

        currentCountry:
            document
                .getElementById("currentCountry")
                .value
                .trim(),

        education:
            document
                .getElementById("education")
                .value,

        occupation:
            document
                .getElementById("occupation")
                .value
                .trim(),

        job:
            document
                .getElementById("job")
                .value
                .trim(),

        availability:
            document
                .getElementById("availability")
                .value,

        criminalRecord:
            document
                .getElementById("criminalRecord")
                .value,

        previousVisa:
            document
                .getElementById("previousVisa")
                .value,

        visaType:
            document
                .getElementById("visaType")
                .value,

        passportNumber:
            document
                .getElementById("passportNumber")
                .value
                .trim(),

        passportExpiry:
            document
                .getElementById("passportExpiry")
                .value,

        whatsapp:
            document
                .getElementById("whatsapp")
                .value
                .trim(),

        email:
            document
                .getElementById("email")
                .value
                .trim(),

        documentsReady:
            document
                .getElementById("documentsReady")
                .checked,

        informationCorrect:
            document
                .getElementById("informationCorrect")
                .checked

    };

}


/*
============================================================
STATUS
============================================================
*/

function showStatus(
    message,
    type
) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        `status-message ${type}`;

}


/*
============================================================
SUBMIT
============================================================
*/

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        /*
        --------------------------------------------
        BROWSER VALIDATION
        --------------------------------------------
        */

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        /*
        --------------------------------------------
        DISABLE BUTTON
        --------------------------------------------
        */

        submitButton.disabled =
            true;

        buttonText.style.display =
            "none";

        buttonLoader.style.display =
            "block";

        statusMessage.className =
            "status-message";


        /*
        --------------------------------------------
        GET DATA
        --------------------------------------------
        */

        const formData =
            getFormData();


        try {


            /*
            ----------------------------------------
            SEND TO VERCEL FUNCTION
            ----------------------------------------
            */

            const response =
                await fetch(
                    "/api/submit",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                formData
                            )

                    }
                );


            const result =
                await response.json();


            /*
            ----------------------------------------
            SUCCESS
            ----------------------------------------
            */

            if (
                response.ok &&
                result.success
            ) {

                showStatus(

                    `Application ${applicationReference} was submitted successfully. Your application has been sent to the WhatsApp Business account.`,

                    "success"

                );


                form.reset();


                /*
                Keep reference visible
                */

                document
                    .getElementById(
                        "referenceNumber"
                    )
                    .textContent =
                    applicationReference;


            }

            else {

                throw new Error(
                    result.message ||
                    "Unable to submit application."
                );

            }


        }

        catch(error) {

            console.error(
                "Submission error:",
                error
            );


            showStatus(

                error.message ||
                "Something went wrong. Please try again.",

                "error"

            );

        }


        /*
        --------------------------------------------
        ENABLE BUTTON
        --------------------------------------------
        */

        submitButton.disabled =
            false;

        buttonText.style.display =
            "inline";

        buttonLoader.style.display =
            "none";

    }
);