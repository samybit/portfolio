import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PortfolioContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export const PortfolioContactEmail = ({
  name,
  email,
  message,
}: PortfolioContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Message from {name} via Portfolio</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>SAMY B.</Heading>
            <Text style={subtitle}>Portfolio Contact Form</Text>
          </Section>
          
          <Hr style={divider} />
          
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>
              Contact Details
            </Heading>
            
            <Section style={fieldContainer}>
              <Text style={fieldLabel}>Sender Name</Text>
              <Text style={fieldValue}>{name}</Text>
            </Section>

            <Section style={fieldContainer}>
              <Text style={fieldLabel}>Sender Email</Text>
              <Link href={`mailto:${email}`} style={emailLink}>
                {email}
              </Link>
            </Section>

            <Section style={fieldContainer}>
              <Text style={fieldLabel}>Message</Text>
              <Text style={messageValue}>{message}</Text>
            </Section>
          </Section>
          
          <Hr style={divider} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Sent from{" "}
              <Link href="https://samyb.vercel.app" style={footerLink}>
                samyb.vercel.app
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PortfolioContactEmail;

const main = {
  backgroundColor: "#050505",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
  padding: "40px 10px",
};

const container = {
  backgroundColor: "#0d0d0d",
  border: "1px solid #1a1a1a",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "3px",
  margin: "0 0 6px 0",
};

const subtitle = {
  color: "#71717a",
  fontSize: "11px",
  fontWeight: "600",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "1.5px",
};

const divider = {
  borderColor: "#1a1a1a",
  margin: "24px 0",
};

const content = {
  margin: "0",
};

const sectionTitle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const fieldContainer = {
  backgroundColor: "#121212",
  border: "1px solid #1f1f1f",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "16px",
};

const fieldLabel = {
  color: "#71717a",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 6px 0",
};

const fieldValue = {
  color: "#e4e4e7",
  fontSize: "15px",
  margin: "0",
};

const emailLink = {
  color: "#6366f1",
  fontSize: "15px",
  textDecoration: "none",
  fontWeight: "500",
};

const messageValue = {
  color: "#e4e4e7",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerText = {
  color: "#52525b",
  fontSize: "12px",
  margin: "0",
};

const footerLink = {
  color: "#71717a",
  textDecoration: "underline",
};
