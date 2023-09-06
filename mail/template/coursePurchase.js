exports.coursePurchaseTemplate = (userName, courseName, courseInstructor) => {
    const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Purchase Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .header {
                background-color: #007BFF;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            h2 {
                font-size: 28px;
                margin-bottom: 20px;
            }
            p {
                font-size: 18px;
                color: #333333;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            strong {
                font-weight: bold;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 20px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🎉 Congratulations on Your Course Purchase! 🎉</h2>
            </div>
            <p>Hello ${userName},</p>
            <p>You've successfully purchased the course "<strong>${courseName}</strong>" by ${courseInstructor}.</p>
            <p>Get ready to embark on a journey of learning and skill development.</p>
            <p>If you have any questions or need assistance, our support team is here to help.</p>
            <p>Happy learning!</p>
            <div class="footer">
                <p>Best regards,<br>Your Professify Team</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return emailHTML;
};
