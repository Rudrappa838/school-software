# Secureye / Biometric Device Integration Guide

This guide explains how to connect your **Secureye S-B8CB** (or similar biometric devices) to the School Management System software.

## Prerequisite
1.  **Network Connection**: The Biometric Device and the Computer running this software must be on the **same WiFi or LAN network**.
2.  **Server Status**: The School Software must be **Running** (e.g., you can see the dashboard).

## Step 1: Find Your Computer's IP Address
For the device to send data to this computer, it needs to know the computer's address.
Your current Local IP Address is: **10.60.101.164**

(Note: If you restart your router, this IP might change. It is recommended to set a Static IP for this computer if possible).

## Step 2: Configure the Biometric Device (Secureye)
Use the menu buttons on your Secureye device to navigate to the **Network** or **Server** settings. The menu names might vary slightly, but look for:

*   **Comm Mode**: Select **Ethernet** or **WiFi** (ensure it is connected).
*   **Cloud / ADMS / Web Server Settings**:
    *   **Server Type**: `Web` or `ADMS` or `Cloud`
    *   **Server IP / URL**: `10.60.101.164`
    *   **Server Port**: `5000`
    *   **Request URL** (if asked): `/api/biometric/external-log`
    *   **Enable Proxy**: `No`

**Save** and **Restart** the device.

## Step 3: Register Users
For the system to recognize who is punching in:
1.  Go to the **Staff Dashboard** or **Admin Dashboard** in the software.
2.  Navigate to **Biometric Management**.
3.  Select **Enrollment Manager**.
4.  Search for a Student or Teacher.
5.  **Scan their Card** on the device or Enter their **Card Number** / **User ID** manually into the system.
    *   *Important*: The "User ID" in the biometric device (e.g., `101`) must match the `RFID Card ID` or `User ID` entered in the software for that person.

## Step 4: Test Connection
1.  Ask a student/staff to place their finger or card on the device.
2.  The device should say "Thank You" or "Verified".
3.  Watch the **software console/terminal** or the **Dashboard Attendance Report**.
4.  The system should automatically:
    *   Receive the attendance data.
    *   Mark the student as **Present**.
    *   Send a **Notification** to the mobile app & SMS.

## Frequently Asked Questions

### What if I use a different machine?
If you move the software to a different computer:
1.  Find the **new IP address** of that computer.
2.  Update the **Server IP** in the Secureye device settings to match the new computer.

### Can I use multiple devices?
**Yes.** You can connect as many devices as you want (e.g., one for Boys Hostel, one for Main Gate). Just configure **all of them** to point to the same Server IP (`10.60.101.164`) and Port (`5000`).

### The device says "Connected" but data is not showing?
1.  Check your Firewalls. Windows Firewall might be blocking Port `5000`.
2.  Try turning off the Firewall temporarily to test.
3.  Ensure the "User ID" on the device exists in the software.

### How do Notifications work?
*   When a "success" punch is received, the system instantly triggers a notification to the Mobile App and sends an SMS to the registered contact number.
