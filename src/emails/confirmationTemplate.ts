const appURL = process.env.APP_URL as string

export const confirmationTemplate = `
  <html>
    <body>
      <p>
        Thank you for creating your NotionClient account. <br>
        To complete your registration, click the link below: <br>
        <a href='${appURL}/v1/users/confirm-email/{{publicId}}'>Confirm your account here</a> <br>
      </p>
    </body>
  </html>
`
