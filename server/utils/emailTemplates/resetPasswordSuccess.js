const resetPasswordSuccess = (user, EMAIL_FROM) => {
  return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Successful - BudgetBee</title>
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">

                <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f3f3">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1 style="color: #2A2A2A;">BudgetBee</h1>
                            <table width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td align="left" style="padding: 40px;">

                                        <h2 style="color: #2A2A2A;">User Password Reset Success</h2>

                                        <p style="color: #4A4A4A; font-size: 14px;">Hi, <span style="font-weight: bold;">${user.name}</span>,</p>

                                        <p style="color: #4A4A4A; font-size: 14px;">You are receiving this email because you (or someone else) have successfully reset the password of your <a href="https://budgetbee-s.netlify.app/" style="color: #4CAF50; text-decoration: none;">BudgetBee</a> user account.</p>

                                        <p style="color: #4A4A4A; font-size: 14px;">If this was you, you can safely ignore this email.<br>
                                        If not, please reach out to us at <a href="mailto:${EMAIL_FROM}" style="color: #4CAF50; text-decoration: none;">email us</a> for help.</p>

                                        <p style="color: #4A4A4A; font-size: 14px;">Thanks & Regards,<br>
                                        BudgetBee and Team.</p>

                                        <!-- Divider -->
                                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0; width: 100%;" />

                                        <div style="margin-top: 30px; text-align: center;">
                                            <a href="https://www.linkedin.com/in/iqra-khan-4b8649304/" style="margin: 0 10px; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24" />
                                            </a>
                                            <a href="https://github.com/iqra77818" style="margin: 0 10px; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="24" height="24" />
                                            </a>
                                            <a href="http://localhost:3000/" style="margin: 0 10px; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Website" width="24" height="24" />
                                            </a>
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <p style="color: #9A9A9A; font-size: 12px; margin-top: 20px;">This message was sent from BudgetBee Pvt. Ltd, India 560064</p>

                        </td>
                    </tr>
                </table>

            </body>
            </html>`; // Html Body Ending Here.
};

module.exports = resetPasswordSuccess;
