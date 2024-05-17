export const confirmationTemplate = `
  <html>
    <body>
      <p>
        Thank you for creating your NotionClient account. <br>
        To complete your registration, click the link below: <br>
        <a href='http://localhost:8080/v1/users/confirm-email/{{publicId}}'>Confirm your account here</a> <br>
      </p>
    </body>
  </html>
`
