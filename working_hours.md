Date      |Hours|Description
----------|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
2023-11-11|12   |Built backend user management and Github actions pipeline
2023-11-12|7    |Added database connection to backend and built tests
2023-11-16|14   |Added frontend, login page, simple chat page, added simple socket-io connection with simple messaging functionality
2023-11-18|16   |Improved on socket messaging, added styles to client, configured development and production modes to run seamlessly
2023-11-19|8    |Added e2e testing and deployed to render. Also added tag release and deployment to CI pipeline
2023-11-21|2    |Improved README documentation
2023-11-22|15   |Implemented tracking for which users are online/connected. Added private chat functionality. Implemented saving chats to redux.
2023-11-23|6    |Added E2E testing for private chats. No multiple client testing (E2E or websocket tests) yet despite trying for hours and failing miserably.
2023-11-28|8    |Added multiple client socket testing to backend successfully. Few changes to socket events to make testing easier. Updated documentation.
2023-11-29|5    |Added migrations for database
2023-11-30|6    |Slight layout improvements to navbar, Added styled chat bubbles
2023-11-30|5    |Tried adding chat messages to database. Came to the conclusion that maybe I should change to a more typescript friendly ORM than sequelize
2023-12-02|9    |Researching different ORM options to replace Sequelize. (with better typescript support). Migrated to TypeORM from Sequelize. Added TypeORM schema migrations.
2023-12-03|11   |Added storing private messages. Added AES encryption for message content in database.
2023-12-05|6    |Added restoring private messages on refresh. Added better error handling to frontend. (Logout on connection error/invalid token). Fixed issues that occurred when accessing database on socket event handlers
2023-12-07|6    |Created tests for private message restoration and users socket event
2023-12-08|3    |Added visual improvements to chat. Researched if ASCII art could be used in chat by adding multiline input field and changing messages to monospace font. Decided not to keep these changes as they hindered user experience. Might later implement images to compensate for the lack of artistic possibilities.
2023-12-08|4    |Added redis database for caching global chat for an hour.
2023-12-09|3    |Added tests and pipeline changes after implementing Redis. Added docker-compose for running databases in development
2023-12-09|5    |Added server event storing and restoring on connect.
2023-12-16|7    |Added multiline support for chat input field and messages. Worked on making the navbar collapsible. Didn't yet find an optimal way of doing so as MUI AppBar component isn't working as desired.
2023-12-17|4    |Found an alternate way to improve mobile layout. Added tooltips. Added tests for multiline messages.
2024-01-06|3    |Researched Redis and changed the way list type data is stored in the Redis database. Now each value has it's own TTL.
2024-01-20|5    |Containerized the application. Researched ways to optimize the image size as much as possible without hindering the performance. This is done with a multistage Dockerfile and an optimized node base image. App can now run in it's entirety (including databases) using one docker-compose.
2024-01-21|8    |Added docker image creation to CI workflow. It then publishes it to GitHub Container Repository. Pipeline also takes care of image versioning. It uses the same version as the release version attached to the commit.  Also added another web service to Render, that deploys the docker image. Latest image is deployed in the CI pipeline also.
Combined  |178  |

This web-based tool was used to convert this from excel to markdown: https://tabletomarkdown.com/convert-spreadsheet-to-markdown/
