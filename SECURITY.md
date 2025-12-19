# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Agent Explorer seriously. If you discover a security vulnerability, please follow these steps:

### Do NOT

- Open a public GitHub issue
- Disclose the vulnerability publicly before it's fixed
- Exploit the vulnerability beyond what's necessary to demonstrate it

### Do

1. **Email us** at security@8004.dev with:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

2. **Allow time** for us to investigate and respond (typically within 48 hours)

3. **Work with us** to understand and resolve the issue

### What to Expect

- **Initial Response**: Within 48 hours of your report
- **Status Update**: Within 5 business days with our assessment
- **Resolution Timeline**: Depends on severity:
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2-4 weeks
  - Low: Next scheduled release

### Recognition

We appreciate the security research community's efforts. Responsible reporters will be:

- Credited in our release notes (unless anonymity is preferred)
- Acknowledged in our security advisories
- Considered for our future bug bounty program (when launched)

## Security Best Practices

### For Users

- Keep your dependencies up to date
- Review environment variables before deployment
- Use secure RPC endpoints (HTTPS)
- Never commit `.env` files with real credentials

### For Contributors

- Follow secure coding practices
- Never log sensitive information
- Validate all external inputs
- Use parameterized queries for any database operations
- Review dependencies for known vulnerabilities

## Known Security Considerations

### API Keys

- RPC URLs may contain API keys - never expose these publicly
- Backend API keys should be server-side only
- Client-side code should not contain sensitive credentials

### Data Handling

- Agent Explorer is read-only and does not store user data
- All blockchain data is fetched from public APIs
- No wallet connections or transaction signing

## Contact

For security concerns: security@8004.dev

For general questions: See [CONTRIBUTING.md](./CONTRIBUTING.md)
