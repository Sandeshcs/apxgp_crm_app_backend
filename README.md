## APXGP CRM APP
A lead and sales agent management app where you can display, add, update leads and sales agent and perform filter and sortby and can add comments.

Built with React.js frontend, Express.js/Node.js backend, MongoDB database.

---

## App Demo Link
[App Demo Link](https://apxgp-crm-app-frontend.vercel.app/)

---

## Quick Start

```
git clone https://github.com/Sandeshcs/apxgp_crm_app_backend.git
cd apxgp_crm_app_backend
npm install
node index.js
```

## Technologies
- React.js
- React Router
- Node.js
- Express.js
- MongoDB

---

## App Demo Video
Watch a walkthrough ( 7minutes ) of all the major features of this app:
[App Demo Video](https://drive.google.com/file/d/11ta2d6NaX4qyR0Zc6aOV9u4ruexTqY6u/view?usp=sharing)

---

## API Reference
### Leads Api's
#### GET /api/leads
Display all leads.
- Status 200 ok for fetching all leads.
- Status 404 not found if no leads are present.
- Status 500 for internal server error.

Sample Resopnse:
```
[{_id, name, status, source, salesAgent, tags, timeToClose, priority, createdAt, updatedAt, closedAt}, ...]
```

#### GET /api/leads?filterOneName=filterOneValue&filterTwoName=filterTwoValue&filterThreeName=filterThreeValue&sortby=sortByName&order=des/asc
Display all leads based on filter and sortby and order.
If no filter, sortby, order selected then all leads are displayed.
- Status 200 ok for fetching all leads or fetching only filter and sortby leads.
- Status 404 not found if no leads are present for the requested filter, sortby, order.
- Status 500 for internal server error.

Sample Resopnse:
```
[{_id, name, status, source, salesAgent, tags, timeToClose, priority, createdAt, updatedAt closedAt}, ...]
```

#### POST /api/leads
Post lead data when we click submit button in add new lead form.
- Status 201 created for creating new lead.
- Status 400 for bad request, validation error, sales agent id invalid.
- Status 500 for internal server error.

Sample Resopnse:
```
{_id, name, status, source, salesAgent, tags, timeToClose, priority, createdAt, updatedAt, closedAt}
```

#### POST(update) /api/leads/:leadId
Update lead data when we click submit in edit/update lead button in individual lead management and comment section.
- Status 200 ok for updating a lead.
- Status 404 not found if the requested lead is not present to update.
- Status 500 for internal server error.

Sample Resopnse:
```
{_id, name, status, source, salesAgent, tags, timeToClose, priority, createdAt, updatedAt, closedAt}
```

### Sales agent Api's
#### GET /api/sales-agent
Display all sales agent.
- Status 200 ok for fetching all sales agents.
- Status 404 not found if no sales agent are present.
- Status 500 for internal server error.

Sample Resopnse:
```
[{_id, name, email}, ...]
```

#### POST /api/sales-agent
Post new sales agent when we click submit in add new sales agent form.
- Status 201 created for creating new sales agent.
- Status 400 bad request, validation error, unique email.
- Status 500 for internal server error.

Sample Resopnse:
```
{_id, name, email}
```

### Comments Api's
#### GET /api/comments/
Fetch all comments then we filter and display comments of specific lead.
- Status 200 ok for fetching all comments.
- Status 404 not found if no comments are present.
- Status 500 for internal server error.

Sample Response:

```
[{_id, lead, author, commentText}, ...]
```
* Lead in response means leadId used to filter and display comments of specific lead.
* Author in response means sales agent who commented.

---

#### POST /api/comments
Post new comment when submit button clicked.
- Status 201 created for creating new comment.
- Status 400 for bad request.
- Status 500 for internal server error.

Sample Response:

```
{_id, lead, author, commentText}
```

## Contact
For bugs or feature request please reach out to sandeshcs2921@gmail.com.