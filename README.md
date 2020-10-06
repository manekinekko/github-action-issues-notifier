## Issues Notifier

This is a GitHub Action that sends a notification email when an issue was labeled with a particular label.


### Usage

```yml
  - name: Notifier
    uses: manekinekko/github-action-issues-notifier@v1
    id: notifier
    with:
      smtpHost: ${{ secrets.SMTP_HOST }}
      smtpPort: ${{ secrets.SMTP_HOST }}
      username: ${{ secrets.USERNAME }}
      password: ${{ secrets.PASSWORD }}
      from: ${{ secrets.EMAIL_FROM }}
      to: ${{ secrets.EMAIL_TO }}
      bcc: ${{ secrets.EMAIL_BCC }}
      labels: "critical,urgent,important"
```
