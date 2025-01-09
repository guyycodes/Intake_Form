# System Architecture Documentation: Small Service with Intake Form Integration

## Overview

This document outlines the architecture of a smaller, specialized service designed to integrate with a custom intake form hosted on GitHub Pages. This service manages form submissions and associated data storage, ensuring HIPAA compliance and data integrity. And is a MicroServie to the primary STJDA Web app lcated here https://github.com/stjda/Summer_Camp_Manager.

## Technologies Used

- **Frontend**: React.js for dynamic UI elements on the custom intake form.
- **Backend**: Node.js with Express framework, ensuring efficient handling of API requests and server-side logic.
- **Encryption and Security**: ZeroSSL for HTTPS encryption on web communication, ensuring secure data transfer.
- **Data Storage**: Minio object storage for handling form uploads and data storage, encrypted to ensure HIPAA compliance.
- **Server Configuration**: An automated setup running on an bridge network consisting of 3 servers - 2 HTTPS and 1 HTTP - to manage the secure flow and processing of data.
- **SMTP through fastmail guymorganb@levelupco.com** For automated server messaging to ensure server health, the server in both services email the project owner every 12 hours of its status, ensuring the overseerer is able to know if any issues arise.

## Components and Configuration

### Intake Form

- **Host**: The form is hosted at GitHub Pages, providing a public-facing URL for user access. This form captures data necessary for processing within the larger summer camp management system. And is the entrypoint for processing summer camp attendants.

### Minio Database

- **Deployment**: Hosted on a Google Cloud VM, accessible via the administrator interface at `https://34.44.249.236:9001`. This interface is secured and requires authentication for access.
- **Data Storage**: Utilizes object storage to manage both the intake forms and uploads from the larger service. It ensures data at rest is encrypted and complies with HIPAA standards.
- **Data Integrity**: Implements SHA256 checksums as storage keys, ensuring data integrity and secure access to stored data.

## Data Flow and Security

- **Form Uploads**: Users' form uploads are proxied through a series of servers between microservices, images uploads are handled by Minio, and displayed via signed URLs, maintaining confidentiality and integrity.
- **HTTPS Protection**: External communications are protected by HTTPS, while internal communications between services within the Google Cloud private IP address space utilize HTTP for efficiency.
- **TLS Encryption**: Both services implement TLS encryption to ensure secure data transmission, aligning with HIPAA compliance requirements.

## Integration with Larger Service

- **Data Interaction**: The smaller service integrates seamlessly with the larger application, handling specific functionalities related to form intake and storage. Allowing the larger web app to manage the intake lifecycle
- **Service Communication**: Utilizes internal Google Cloud networking to connect with the larger system, ensuring isolated and secure data transfer.

## HIPAA Compliance and Security Measures

- **Encryption**: Data at rest is encrypted using Minio’s built-in encryption capabilities, complementing the HIPAA compliance of the overall system.
- **Access Control**: The Minio database requires authenticated access, ensuring that only authorized personnel can view or manage the stored data.
- **Secure Data Handling**: The use of SHA256 checksums for storage keys not only ensures data integrity but also adds an extra layer of security to the handling and retrieval of sensitive information.

## Summary

This smaller service provides critical functionality to the overarching architecture of the summer camp management application by managing secure and compliant data intake and storage. The integration of React.js, Node.js with Express, Minio, and secure server configurations, alongside the use of HTTPS and TLS encryption, ensures that the service maintains high standards of security and data integrity. This documentation should guide further development and maintenance efforts, ensuring the continuity and scalability of this specialized service.