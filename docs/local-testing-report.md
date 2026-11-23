# App Testing Report

**Date:** 16 November 2026

## Overview

I tested the app locally. The main features are working, but SMS messages do
not work with the SMS details provided through the admin portal. SMS works
with my own SMSPortal sandbox details.

## What we did

- Set up the app to run locally with a local database.
- Started the API and confirmed that it responds.
- Fixed the **Upgrade** button so it can start a plan checkout.
- Updated the local payment return address so checkout can return to the
  locally running admin app.

## What we found

### Text messages

SMSPortal rejected the details from the admin portal, while my own sandbox
details work. The portal-provided details may need to be checked with the
account administrator.

When SMSPortal rejects the account details, the message is not sent. Other app
actions, such as updating an order or shipment, can still complete.

### Plan payments

Plan checkout is separate from customer invoice payments. The current checkout
is a test payment made once; it does not automatically charge every month.

The local payment return address has been updated, but a successful return
from a new checkout has not yet been confirmed. Earlier attempts tried to
return to the public app address, which was unavailable at the time.