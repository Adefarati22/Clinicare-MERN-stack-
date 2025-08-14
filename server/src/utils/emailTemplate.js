export const welcomeUserTemplate = (name, verificationCode, password) => `
<!DOCTYPE html>
<html>
<head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
      </head>
  
  <body>
      <div className="container">
          <div className="header">
              <h1>Welcome to Clinicare</h1>
          </div>
          <div className="content">
              <p>Hello ${name},</p>
              <p>Thank you for registering with us. To get started, please verify your account with the code below.</p>
              ${
                password
                  ? `<p style={{ fontWeight: "bold", fontSize: 20, color: "rgb(21, 66, 119)" }}>Your password is ${password}. Please update your password in the settings as soon as possible.</p>`
                  : ""
              }
              <p style={{ fontWeight: "bold", fontSize: 20, color: "rgb(21, 66, 119)" }}>${verificationCode}</p>
              <p>This code will expire in 1 hour.</p> 
              <p>Do not share this code with anyone.</p>    
          </div>
          <div className="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
      </body>
      </html>`;

export const resendVerificationTemplate = (name, verificationCode) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Verification Code</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>You requested a new verification code. Use the code below to verify your account:</p>
              <p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">${verificationCode}</p>
              <p>This code will expire in 1 hour.</p> 
              <p>Do not share this code with anyone.</p>    
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
</html>`;

export const passwordResetTemplate = (name, email, resetToken) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Reset Password</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Follow the link to reset your password:</p>
              <p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">${
                process.env.CLIENT_BASE_URL
              }/account/reset-password?email=${email}&token=${resetToken}</p>
              <p>Do not share this link with anyone.</p>  
              <p>This link will expire in 15 minutes.</p>  
              <p>If you did not request a password reset, please ignore this email.</p>   
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
</html>
`;
