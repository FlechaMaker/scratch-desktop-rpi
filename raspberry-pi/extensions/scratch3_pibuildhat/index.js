const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const fs = window.require('fs');
const cp = window.require('child_process');
const path = window.require('path');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iODAwIgogICBoZWlnaHQ9IjgwMCIKICAgaWQ9InN2ZzM0MTAiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJyYXNwYmVycnktcGktbG9nb20uc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzNDQ0Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzQ0MiIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEzODEiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTY1IgogICAgIGlkPSJuYW1lZHZpZXczNDQwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLWxlZnQ9Ijc1IgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9Ijc1IgogICAgIGlua3NjYXBlOnpvb209IjAuNzg4NjIwNDgiCiAgICAgaW5rc2NhcGU6Y3g9IjMyMC44NjU1IgogICAgIGlua3NjYXBlOmN5PSIzNjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjQxMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzM0MTAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDI2Ny40MjYxOSw0My42MTUxMzggYyAtMy42MTkzLDAuMTEyMzE5IC03LjUxNzE1LDEuNDQ5MzI3IC0xMS45Mzc1LDQuOTM3NSAtMTAuODI2OTYsLTQuMTc2MyAtMjEuMzI3MDksLTUuNjI3MTg5IC0zMC43MTg3NSwyLjg3NSAtMTQuNDkzODYsLTEuODgwNzU4IC0xOS4yMTAyOSwyLjAwMDc0NCAtMjIuNzgxMjUsNi41MzEyNSAtMy4xODI1NSwtMC4wNjU4NyAtMjMuODE4ODUsLTMuMjcyMDcgLTMzLjI4MTI1LDEwLjg0Mzc1IC0yMy43ODE2NSwtMi44MTM0MiAtMzEuMjk2NzgsMTMuOTg3ODggLTIyLjc4MTI1LDI5LjY1NjI1IC00Ljg1NjkxLDcuNTE4OTUyIC05Ljg4OTUxLDE0Ljk0NzIzMiAxLjQ2ODc1LDI5LjI4MTI1MiAtNC4wMTgwMSw3Ljk4MzUxIC0xLjUyNzQzLDE2LjY0NDAzIDcuOTM3NSwyNy4xMjUgLTIuNDk3ODYsMTEuMjIyNiAyLjQxMjA3LDE5LjE0MDg2IDExLjIxODc1LDI1LjMxMjUgLTEuNjQ3MDksMTUuMzU3NTYgMTQuMDgzNSwyNC4yODc0MyAxOC43ODEyNSwyNy40Njg3NSAxLjgwMzY3LDguOTQ4NjggNS41NjI5MSwxNy4zOTI3IDIzLjUzMTI1LDIyLjA2MjUgMi45NjMyMywxMy4zMzYxIDEzLjc2MjA2LDE1LjYzOTA2IDI0LjIxODc1LDE4LjQzNzUgLTM0LjU2MTkzLDIwLjA4OTU0IC02NC4yMDA2Nyw0Ni41MjI2NiAtNjQsMTExLjM3NSBsIC01LjA2MjUsOS4wMzEyNSBjIC0zOS42MzA4NywyNC4xMDIyOSAtNzUuMjg1Mjk5LDEwMS41NjYyNiAtMTkuNTMxMjUsMTY0LjUzMTI1IDMuNjQxODcsMTkuNzA4MzggOS43NDk1OSwzMy44NjM5NiAxNS4xODc1LDQ5LjUzMTI1IDguMTMzODMsNjMuMTMwNTggNjEuMjE3NjMsOTIuNjkxNjEgNzUuMjE4NzUsOTYuMTg3NSAyMC41MTY1MywxNS42MjgxMiA0Mi4zNjgxOCwzMC40NTY3MiA3MS45Mzc1LDQwLjg0Mzc1IDI3Ljg3NTE1LDI4Ljc0OTQ2IDU4LjA3Mzg4LDM5LjcwNjQgODguNDM3NSwzOS42ODc1IDAuNDQ1MTUsLTIuOGUtNCAwLjg5ODUzLDAuMDA1IDEuMzQzNzUsMCAzMC4zNjM2MywwLjAxODkgNjAuNTYyMzUsLTEwLjkzODA0IDg4LjQzNzUsLTM5LjY4NzUgMjkuNTY5MzIsLTEwLjM4NzAzIDUxLjQyMDk3LC0yNS4yMTU2MyA3MS45Mzc1LC00MC44NDM3NSAxNC4wMDExMiwtMy40OTU4OSA2Ny4wODQ5MiwtMzMuMDU2OTIgNzUuMjE4NzUsLTk2LjE4NzUgNS40Mzc5MSwtMTUuNjY3MjkgMTEuNTQ1NjIsLTI5LjgyMjg3IDE1LjE4NzUsLTQ5LjUzMTI1IDU1Ljc1NDA0LC02Mi45NjQ5OSAyMC4wOTk2MSwtMTQwLjQyODk2IC0xOS41MzEyNSwtMTY0LjUzMTI1IGwgLTUuMDYyNSwtOS4wMzEyNSBjIDAuMjAwNjcsLTY0Ljg1MjM0IC0yOS40MzgwNywtOTEuMjg1NDYgLTY0LC0xMTEuMzc1IDEwLjQ1NjY5LC0yLjc5ODQ0IDIxLjI1NTUyLC01LjEwMTQgMjQuMjE4NzUsLTE4LjQzNzUgMTcuOTY4MzQsLTQuNjY5OCAyMS43Mjc1OCwtMTMuMTEzODIgMjMuNTMxMjUsLTIyLjA2MjUgNC42OTc3NSwtMy4xODEzMiAyMC40MjgzNCwtMTIuMTExMTkgMTguNzgxMjUsLTI3LjQ2ODc1IDguODA2NjgsLTYuMTcxNjQgMTMuNzE2NjEsLTE0LjA4OTkgMTEuMjE4NzUsLTI1LjMxMjUgOS40NjQ5NCwtMTAuNDgwOTcgMTEuOTU1NSwtMTkuMTQxNDkgNy45Mzc1LC0yNy4xMjUgMTEuMzU4MjUsLTE0LjMzNDAyIDYuMzI1NjYsLTIxLjc2MjMgMS40Njg3NSwtMjkuMjgxMjUyIDguNTE1NTMsLTE1LjY2ODM3IDEuMDAwNCwtMzIuNDY5NjcgLTIyLjc4MTI1LC0yOS42NTYyNSAtOS40NjI0LC0xNC4xMTU4MiAtMzAuMDk4NywtMTAuOTA5NjE1IC0zMy4yODEyNSwtMTAuODQzNzUgLTMuNTcwOTYsLTQuNTMwNTA2IC04LjI4NzM5LC04LjQxMjAwOCAtMjIuNzgxMjUsLTYuNTMxMjUgLTkuMzkxNjYsLTguNTAyMTg5IC0xOS44OTE3OSwtNy4wNTEzIC0zMC43MTg3NSwtMi44NzUgLTEyLjg1OTIsLTEwLjE0NzQxMyAtMjEuMzcyMjYsLTIuMDEzMjk2IC0zMS4wOTM3NSwxLjA2MjUgLTE1LjU3Mzg1LC01LjA4Nzc3OCAtMTkuMTMzMDIsMS44ODA5MDggLTI2Ljc4MTI1LDQuNzE4NzUgLTE2Ljk3NTI1LC0zLjU4ODA3NiAtMjIuMTM1Niw0LjIyMzUzMiAtMzAuMjgxMjUsMTIuNDY4NzUgbCAtOS40Njg3NSwtMC4xODc1IGMgLTI1LjYxMDU0LDE1LjA5MzExIC0zOC4zMzM3OCw0NS44MjU1MDIgLTQyLjg0Mzc1LDYxLjYyNTAwMiAtNC41MTIwNiwtMTUuODAxOTggLTE3LjIwNjQ3LC00Ni41MzQ1NDIgLTQyLjgxMjUsLTYxLjYyNTAwMiBsIC05LjQ2ODc1LDAuMTg3NSBjIC04LjE0NTY1LC04LjI0NTIxOCAtMTMuMzA2LC0xNi4wNTY4MjcgLTMwLjI4MTI1LC0xMi40Njg3NSAtNy42NDgyMywtMi44Mzc4NDIgLTExLjIwNzQsLTkuODA2NTI3IC0yNi43ODEyNSwtNC43MTg3NSAtNi4zNzk3MywtMi4wMTg0OTEgLTEyLjI0NjY3LC02LjIxNDQyOCAtMTkuMTU2MjUsLTYgeiIKICAgICBzdHlsZT0iZmlsbDojMDAwMDAwIgogICAgIGlkPSJwYXRoMzQxMiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSAyMTYuNDQzMDMsMTEwLjAxNDQ3IGMgNjcuOTQ3NjcsMzUuMDMxMzYgMTA3LjQ0Njg5LDYzLjM2ODk3IDEyOS4wODcxNyw4Ny41MDQ0NyAtMTEuMDgyMzUsNDQuNDE3NTkgLTY4Ljg5NjM4LDQ2LjQ0NDY0IC05MC4wMzU1OSw0NS4xOTg1OCA0LjMyODQyLC0yLjAxNDc0IDcuOTM5ODgsLTQuNDI3NzggOS4yMjA1MSwtOC4xMzU3NCAtNS4zMDQ0OSwtMy43Njk4MSAtMjQuMTEyODksLTAuMzk3MTkgLTM3LjI0MzYzLC03Ljc3NDE2IDUuMDQ0MDcsLTEuMDQ0OTkgNy40MDM0OCwtMi4wNjMwMiA5Ljc2Mjg5LC01Ljc4NTQyIC0xMi40MDU3MSwtMy45NTY3IC0yNS43Njg2MiwtNy4zNjY0MiAtMzMuNjI3NzUsLTEzLjkyMTE2IDQuMjQxMjUsMC4wNTI0IDguMjAxMTYsMC45NDg4IDEzLjc0MDM3LC0yLjg5MjcxIC0xMS4xMTE3LC01Ljk4ODE5IC0yMi45NjkxMSwtMTAuNzMzNTEgLTMyLjE4MTM5LC0xOS44ODczOCA1Ljc0NTIxLC0wLjE0MDYzIDExLjkzOTQ1LC0wLjA1NjggMTMuNzQwMzcsLTIuMTY5NTMgLTEwLjE3MDQ0LC02LjMwMDY4IC0xOC43NTEyNCwtMTMuMzA3ODcgLTI1Ljg1MzU5LC0yMC45NzIxNSA4LjAzOTk4LDAuOTcwNTIgMTEuNDM1MjgsMC4xMzQ3OCAxMy4zNzg3OCwtMS4yNjU1NiAtNy42ODc4LC03Ljg3NDE5IC0xNy40MTc1NiwtMTQuNTIzMTkgLTIyLjA1NjkxLC0yNC4yMjY0NCA1Ljk2OTYsMi4wNTc0OCAxMS40MzEyNSwyLjg0NTA2IDE1LjM2NzUyLC0wLjE4MDc5IC0yLjYxMjM3LC01Ljg5MzQ2IC0xMy44MDU0MiwtOS4zNjk2MiAtMjAuMjQ4OTcsLTIzLjE0MTY4IDYuMjg0MzYsMC42MDkzOCAxMi45NDk2MSwxLjM3MTExIDE0LjI4Mjc1LDAgLTIuOTIyMywtMTEuODg4NTYgLTcuOTI3NDUsLTE4LjU3MDAzMiAtMTIuODM2MzksLTI1LjQ5MjAwMiAxMy40NTAwNCwtMC4xOTk3MyAzMy44Mjc3NSwwLjA1MjMgMzIuOTA0NTcsLTEuMDg0NzcgbCAtOC4zMTY1NCwtOC40OTczMyBjIDEzLjEzNzYxLC0zLjUzNzI1IDI2LjU4MDY1LDAuNTY4MTYgMzYuMzM5NjYsMy42MTU4OCA0LjM4MTg2LC0zLjQ1NzY4IC0wLjA3NzYsLTcuODI5OTggLTUuNDIzODMsLTEyLjI5NDAxIDExLjE2NDk2LDEuNDkwNjQgMjEuMjUzODIsNC4wNTczOSAzMC4zNzM0NSw3LjU5MzM2IDQuODcyMzgsLTQuMzk5MzMgLTMuMTYzODksLTguNzk4NjYgLTcuMDUwOTgsLTEzLjE5Nzk5IDE3LjI0OTM2LDMuMjcyNTcgMjQuNTU3MTYsNy44NzA2OCAzMS44MTk4MSwxMi40NzQ4MSA1LjI2OTM1LC01LjA1MDggMC4zMDE2NiwtOS4zNDMzIC0zLjI1NDMsLTEzLjc0MDM2OSAxMy4wMDU2Niw0LjgxNzA0OSAxOS43MDQ3OCwxMS4wMzU1NDkgMjYuNzU3NTYsMTcuMTc1NDU5IDIuMzkxMTksLTMuMjI3MDUgNi4wNzQ5NCwtNS41OTI0IDEuNjI3MTUsLTEzLjM3ODc4IDkuMjM0MTYsNS4zMjI3MyAxNi4xODkyNiwxMS41OTUwNiAyMS4zMzM3NCwxOC42MjE4MiA1LjcxMzM2LC0zLjYzNzk0IDMuNDAzODcsLTguNjEzMDIgMy40MzUwOSwtMTMuMTk3OTkgOS41OTY2NSw3LjgwNjUyIDE1LjY4Njg3LDE2LjExMzk1IDIzLjE0MTY4LDI0LjIyNjQ1IDEuNTAxNjksLTEuMDkzNDQgMi44MTY2MSwtNC44MDE3MSAzLjk3NzQ3LC0xMC42NjY4NyAyMi44OTUzOSwyMi4yMTE4MTIgNTUuMjQ1OTEsNzguMTU4MjQyIDguMzE2NTQsMTAwLjM0MDg2MiAtMzkuOTE4NzcsLTMyLjk0NzE2IC04Ny42MTYxMywtNTYuODg3NTMgLTE0MC40NzcyMSwtNzQuODQ4ODYgeiIKICAgICBzdHlsZT0iZmlsbDojNzVhOTI4IgogICAgIGlkPSJwYXRoMzQxNCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSA1NzYuOTc2MDYsMTEwLjAxNDQ3IGMgLTY3Ljk0NzY3LDM1LjAzMTM2IC0xMDcuNDQ2ODksNjMuMzY4OTcgLTEyOS4wODcxNyw4Ny41MDQ0NyAxMS4wODIzNSw0NC40MTc1OSA2OC44OTYzOCw0Ni40NDQ2NCA5MC4wMzU1OSw0NS4xOTg1OCAtNC4zMjg0MiwtMi4wMTQ3NCAtNy45Mzk4OCwtNC40Mjc3OCAtOS4yMjA1MSwtOC4xMzU3NCA1LjMwNDQ5LC0zLjc2OTgxIDI0LjExMjg5LC0wLjM5NzE5IDM3LjI0MzYzLC03Ljc3NDE2IC01LjA0NDA3LC0xLjA0NDk5IC03LjQwMzQ4LC0yLjA2MzAyIC05Ljc2Mjg5LC01Ljc4NTQyIDEyLjQwNTcxLC0zLjk1NjcgMjUuNzY4NjIsLTcuMzY2NDIgMzMuNjI3NzUsLTEzLjkyMTE2IC00LjI0MTI2LDAuMDUyNCAtOC4yMDExNiwwLjk0ODggLTEzLjc0MDM3LC0yLjg5MjcxIDExLjExMTY5LC01Ljk4ODE5IDIyLjk2OTExLC0xMC43MzM1MSAzMi4xODEzOSwtMTkuODg3MzggLTUuNzQ1MjEsLTAuMTQwNjMgLTExLjkzOTQ1LC0wLjA1NjggLTEzLjc0MDM3LC0yLjE2OTUzIDEwLjE3MDQ0LC02LjMwMDY4IDE4Ljc1MTI0LC0xMy4zMDc4NyAyNS44NTM1OSwtMjAuOTcyMTUgLTguMDM5OTgsMC45NzA1MiAtMTEuNDM1MjgsMC4xMzQ3OCAtMTMuMzc4NzgsLTEuMjY1NTYgNy42ODc3OSwtNy44NzQxOSAxNy40MTc1NiwtMTQuNTIzMTkgMjIuMDU2OTEsLTI0LjIyNjQ0IC01Ljk2OTYxLDIuMDU3NDggLTExLjQzMTI1LDIuODQ1MDYgLTE1LjM2NzUyLC0wLjE4MDc5IDIuNjEyMzcsLTUuODkzNDYgMTMuODA1NDEsLTkuMzY5NjIgMjAuMjQ4OTcsLTIzLjE0MTY4IC02LjI4NDM2LDAuNjA5MzggLTEyLjk0OTYxLDEuMzcxMTEgLTE0LjI4Mjc2LDAgMi45MjIzMSwtMTEuODg4NTYgNy45Mjc0NiwtMTguNTcwMDIyIDEyLjgzNjQsLTI1LjQ5MjAwMiAtMTMuNDUwMDQsLTAuMTk5NzMgLTMzLjgyNzc1LDAuMDUyNCAtMzIuOTA0NTcsLTEuMDg0NzcgbCA4LjMxNjU0LC04LjQ5NzMzIGMgLTEzLjEzNzYyLC0zLjUzNzI1IC0yNi41ODA2NSwwLjU2ODE2IC0zNi4zMzk2NiwzLjYxNTg4IC00LjM4MTg2LC0zLjQ1NzY4IDAuMDc3NiwtNy44Mjk5OCA1LjQyMzgzLC0xMi4yOTQwMSAtMTEuMTY0OTYsMS40OTA2NCAtMjEuMjUzODIsNC4wNTczOSAtMzAuMzczNDUsNy41OTMzNiAtNC44NzIzOCwtNC4zOTkzMyAzLjE2Mzg5LC04Ljc5ODY2IDcuMDUwOTgsLTEzLjE5Nzk5IC0xNy4yNDkzNiwzLjI3MjU3IC0yNC41NTcxNiw3Ljg3MDY4IC0zMS44MTk4MSwxMi40NzQ4MSAtNS4yNjkzNSwtNS4wNTA4IC0wLjMwMTY2LC05LjM0MzMgMy4yNTQzLC0xMy43NDAzNjkgLTEzLjAwNTY2LDQuODE3MDQ5IC0xOS43MDQ3OCwxMS4wMzU1NDkgLTI2Ljc1NzU2LDE3LjE3NTQ1OSAtMi4zOTExOSwtMy4yMjcwNSAtNi4wNzQ5NCwtNS41OTI0IC0xLjYyNzE1LC0xMy4zNzg3OCAtOS4yMzQxNiw1LjMyMjczIC0xNi4xODkyNiwxMS41OTUwNiAtMjEuMzMzNzQsMTguNjIxODIgLTUuNzEzMzYsLTMuNjM3OTQgLTMuNDAzODcsLTguNjEzMDIgLTMuNDM1MDksLTEzLjE5Nzk5IC05LjU5NjY1LDcuODA2NTIgLTE1LjY4Njg3LDE2LjExMzk1IC0yMy4xNDE2OCwyNC4yMjY0NSAtMS41MDE2OSwtMS4wOTM0NCAtMi44MTY2MSwtNC44MDE3MSAtMy45Nzc0NywtMTAuNjY2ODcgLTIyLjg5NTM5LDIyLjIxMTgxMiAtNTUuMjQ1OTEsNzguMTU4MjQyIC04LjMxNjU0LDEwMC4zNDA4NjIgMzkuOTE4NzcsLTMyLjk0NzE2IDg3LjYxNjEzLC01Ni44ODc1MyAxNDAuNDc3MjEsLTc0Ljg0ODg2IHoiCiAgICAgc3R5bGU9ImZpbGw6Izc1YTkyOCIKICAgICBpZD0icGF0aDM0MTYiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNDc4Ljk5NzUzLDU2Mi4zMTk5MyBhIDgxLjM5MDExMSw3NS4wNTE3NjIgMCAwIDEgLTE2Mi43ODAyMiwwIDgxLjM5MDExMSw3NS4wNTE3NjIgMCAxIDEgMTYyLjc4MDIyLDAgeiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQxOCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0iTSAzNTAuNTA1MjEsMzQ3LjkyMTMxIEEgNzIuOTk4ODM5LDg2LjEyOTY3NCAzNC4wMzQyMjYgMCAxIDI1NS41MzczNyw0OTEuNjMzNTcgNzIuOTk4ODM5LDg2LjEyOTY3NCAzNC4wMzQyMjYgMSAxIDM1MC41MDUyMSwzNDcuOTIxMzEgWiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQyMCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0iTSA0NDEuNTM3MzksMzQzLjkyMTMxIEEgODYuMTI5Njc0LDcyLjk5ODgzOSA1NS45NjU3NzQgMCAwIDUzNi41MDUyMyw0ODcuNjMzNTcgODYuMTI5Njc0LDcyLjk5ODgzOSA1NS45NjU3NzQgMSAwIDQ0MS41MzczOSwzNDMuOTIxMzEgWiIKICAgICBzdHlsZT0iZmlsbDojYmMxMTQyIgogICAgIGlkPSJwYXRoMzQyMiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgZD0ibSAxODEuOTYxNDQsMzg0LjA0NjY5IGMgMzYuNDE0MjIsLTkuNzU2OTIgMTIuMjkxNTksMTUwLjYzNjUxIC0xNy4zMzMzOCwxMzcuNDc1NzcgLTMyLjU4Njc3LC0yNi4yMTI2OCAtNDMuMDgzMDcsLTEwMi45NzU0MyAxNy4zMzMzOCwtMTM3LjQ3NTc3IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNjAyLjcyOTQ3LDM4Mi4wNDY2OSBjIC0zNi40MTQyMiwtOS43NTY5MiAtMTIuMjkxNiwxNTAuNjM2NTEgMTcuMzMzMzgsMTM3LjQ3NTc3IDMyLjU4Njc3LC0yNi4yMTI2OCA0My4wODMwNywtMTAyLjk3NTQzIC0xNy4zMzMzOCwtMTM3LjQ3NTc3IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjYiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gNDc5LjAyMjc3LDI2Mi42MTIyOSBjIDYyLjgzNDg2LC0xMC42MTAxMyAxMTUuMTE1OTQsMjYuNzIyMjkgMTEzLjAxMTM4LDk0Ljg1Nzk2IC0yLjA2NjkzLDI2LjEyMTEyIC0xMzYuMTU4NzIsLTkwLjk2OTA3IC0xMTMuMDExMzgsLTk0Ljg1Nzk2IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MjgiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzA1LjQxMDk0LDI2MC42MTIyOSBjIC02Mi44MzQ4NiwtMTAuNjEwMTMgLTExNS4xMTU5NCwyNi43MjIyOSAtMTEzLjAxMTM4LDk0Ljg1Nzk2IDIuMDY2OTMsMjYuMTIxMTIgMTM2LjE1ODcyLC05MC45NjkwNyAxMTMuMDExMzgsLTk0Ljg1Nzk2IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzAiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzk1LjY3MDUxLDI0NC43MTQ1NyBjIC0zNy41MDI1OSwtMC45NzU0OCAtNzMuNDk1NDgsMjcuODM0MTggLTczLjU4MTU4LDQ0LjU0NDQzIC0wLjEwNDYyLDIwLjMwNDI2IDI5LjY1MTIsNDEuMDkyNjYgNzMuODM3MjYsNDEuNjIwMzUgNDUuMTIzMDUsMC4zMjMyMSA3My45MTU2MSwtMTYuNjQwNDkgNzQuMDYxMSwtMzcuNTk0MDkgMC4xNjQ4NCwtMjMuNzM5OTYgLTQxLjAzODc5LC00OC45Mzc0NCAtNzQuMzE2NzgsLTQ4LjU3MDY5IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzIiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMzk3Ljk2MDU2LDY2MS4wNzU2NCBjIDMyLjY5NzQ0LC0xLjQyNzExIDc2LjU3MDgzLDEwLjUzMTk2IDc2LjY1NjgsMjYuMzk1OTggMC41NDI3LDE1LjQwNTIgLTM5Ljc4OTY5LDUwLjIxMDU1IC03OC44MjYzNCw0OS41Mzc2NSAtNDAuNDI3MjksMS43NDM5MSAtODAuMDY5MDgsLTMzLjExNTU5IC03OS41NDk1MSwtNDUuMTk4NTkgLTAuNjA1MDYsLTE3LjcxNTkzIDQ5LjIyNiwtMzEuNTQ3OTYgODEuNzE5MDUsLTMwLjczNTA0IHoiCiAgICAgc3R5bGU9ImZpbGw6I2JjMTE0MiIKICAgICBpZD0icGF0aDM0MzQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIGQ9Im0gMjc3LjE4OTkzLDU2Ny4wNjI1OCBjIDIzLjI3OTEsMjguMDQ1NzMgMzMuODkwNjYsNzcuMzE4OTkgMTQuNDYzNTUsOTEuODQzNTMgLTE4LjM3OTE3LDExLjA4Nzg0IC02My4wMTIyOCw2LjUyMTYyIC05NC43MzYyNCwtMzkuMDUxNTcgLTIxLjM5NTA1LC0zOC4yNDE2OCAtMTguNjM3NTgsLTc3LjE1NjYzIC0zLjYxNTg5LC04OC41ODkyNCAyMi40NjQ0MywtMTMuNjg0MjkgNTcuMTczNDMsNC43OTkwMiA4My44ODg1OCwzNS43OTcyOCB6IgogICAgIHN0eWxlPSJmaWxsOiNiYzExNDIiCiAgICAgaWQ9InBhdGgzNDM2IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBkPSJtIDUxNC4wNzIwOSw1NTguMTcwNjYgYyAtMjUuMTg2ODIsMjkuNTAxNjUgLTM5LjIxMjI3LDgzLjMwOTUxIC0yMC44Mzc4NSwxMDAuNjQyOCAxNy41NjgyOCwxMy40NjM2MSA2NC43MjkyLDExLjU4MTYyIDk5LjU2NTY2LC0zNi43NTU3NCAyNS4yOTU5OSwtMzIuNDY0NzEgMTYuODIwMTMsLTg2LjY4MjI1IDIuMzcwNzcsLTEwMS4wNzUxMSAtMjEuNDY0MDgsLTE2LjYwMjEzIC01Mi4yNzY5MSw0LjY0NDg5IC04MS4wOTg1OCwzNy4xODgwNSB6IgogICAgIHN0eWxlPSJmaWxsOiNiYzExNDIiCiAgICAgaWQ9InBhdGgzNDM4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+Cjwvc3ZnPgo='

/**
 * Class for the Raspberry Pi BuildHAT blocks in Scratch 3.0
 * @constructor
 */
class Scratch3PiBuildHATBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Raspberry Pi BuildHAT';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'pibuildhat';
    }
    
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Motor status
        this.ready = false;
        this.motorStatus = {
            A: {
                connected: false,
                speed: 0,
                position: 0,
                absolutePosition: 0
            },
            B: {
                connected: false,
                speed: 0,
                position: 0,
                absolutePosition: 0
            },
            C: {
                connected: false,
                speed: 0,
                position: 0,
                absolutePosition: 0
            },
            D: {
                connected: false,
                speed: 0,
                position: 0,
                absolutePosition: 0
            }
        };
        this.error = null;

        this.scriptsDir = path.join(__static, '/scripts/');

        this.motorRunProcess = cp.spawn('python', [path.join(this.scriptsDir, 'motor.py')]);
        this.motorRunProcess.stdout.on('data', (data_str) => {
            try {
                const data = JSON.parse(data_str);

                switch (data.type) {
                    case 'status':
                        if (data.status === 'ready') {
                            this.ready = true;
                            data.connected_ports.forEach((port) => {
                                this.motorStatus[port].connected = true;
                            });
                        }
                        break;
                    case 'data':
                        this.motorStatus[data.no].speed = data.sensors.speed;
                        this.motorStatus[data.no].position = data.sensors.pos;
                        this.motorStatus[data.no].absolutePosition = data.sensors.apos;
                        break;
                }
            }
            catch (e) {
                this.error = e;
                console.error('Error parsing motor data:', e);
            }
        });
        this.motorRunProcess.stderr.on('data', (data) => {
            this.error = e;
            console.error(`stderr: ${data}`);
        });

    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3PiBuildHATBlocks.EXTENSION_ID,
            name: Scratch3PiBuildHATBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'motor_is_ready',
                    text: formatMessage({
                        id: 'pibuildhat.motor_is_ready',
                        default: 'モーターが準備完了',
                        description: 'Check if motor is ready'
                    }),
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'motor_start',
                    text: formatMessage({
                        id: 'pibuildhat.motor_start',
                        default: 'モーター [ID] を速度 [SPEED] (-100~100) で回転開始',
                        description: 'Start motor at speed'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'motor_stop',
                    text: formatMessage({
                        id: 'pibuildhat.motor_stop',
                        default: 'モーター [ID] を停止',
                        description: 'Stop motor'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        }
                    }
                },
                {
                    opcode: 'motor_run_for_degrees',
                    text: formatMessage({
                        id: 'pibuildhat.motor_run_for_degrees',
                        default: 'モーター [ID] を [DEGREES] 度 (-180~180) [SPEED] の速さ (-100~100)で動かす',
                        description: 'Run motor for degrees'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        },
                        DEGREES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 180
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }

                },
                {
                    opcode: 'motor_run_for_rotations',
                    text: formatMessage({
                        id: 'pibuildhat.motor_run_for_rotations',
                        default: 'モーター [ID] を [ROTATIONS] 回転 [SPEED] の速さ (-100~100)で動かす',
                        description: 'Run motor for rotations'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        },
                        ROTATIONS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    },
                },
                {
                    opcode: 'motor_run_for_seconds',
                    text: formatMessage({
                        id: 'pibuildhat.motor_run_for_seconds',
                        default: 'モーター [ID] を [SECONDS] 秒 [SPEED] の速さ (-100~100)で動かす',
                        description: 'Run motor for seconds'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        },
                        SECONDS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'motor_run_to_position',
                    text: formatMessage({
                        id: 'pibuildhat.motor_run_to_position',
                        default: 'モーター [ID] を [POSITION] の位置に速さ [SPEED] (-100~100) で動かす',
                        description: 'Run motor to position'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            menu: 'motor_no',
                            defaultValue: 'A'
                        },
                        POSITION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
            ],
            menus: {
                motor_no: {
                    items: [
                        {
                            text: formatMessage({
                                id: 'pibuildhat.motor_id_a',
                                default: 'A',
                                description: 'motor id A'
                            }),
                            value: 'A'
                        },
                        {
                            text: formatMessage({
                                id: 'pibuildhat.motor_id_b',
                                default: 'B',
                                description: 'motor id B'
                            }),
                            value: 'B'
                        },
                        {
                            text: formatMessage({
                                id: 'pibuildhat.motor_id_c',
                                default: 'C',
                                description: 'motor id C'
                            }),
                            value: 'C'
                        },
                        {
                            text: formatMessage({
                                id: 'pibuildhat.motor_id_d',
                                default: 'D',
                                description: 'motor id D'
                            }),
                            value: 'D'
                        }
                    ]
                }
            }
        };
    }

    motor_is_ready () {
        return this.ready;
    }

    motor_start (args)
    {
        const id = Cast.toString(args.ID);
        const speed = Cast.toNumber(args.SPEED);

        const params = JSON.stringify({
            motor_no: id,
            command: 'start',
            params: [
                speed,
            ]
        }) + '\n';
        this.motorRunProcess.stdin.write(params);
    }

    motor_stop (args) {
        const id = Cast.toString(args.ID);

        const params = JSON.stringify({
            motor_no: id,
            command: 'stop',
            params: []
        }) + '\n';
        this.motorRunProcess.stdin.write(params);
    }

    motor_run_for_degrees (args)
    {
        const id = Cast.toString(args.ID);
        const degrees = Cast.toNumber(args.DEGREES);
        const speed = Cast.toNumber(args.SPEED);
        const params = JSON.stringify({
            motor_no: id,
            command: 'run_for_degrees',
            params: [
                degrees,
                speed,
            ]
        }) + '\n';

        this.motorRunProcess.stdin.write(params);
    }

    motor_run_for_rotations (args)
    {
        const id = Cast.toString(args.ID);
        const rotations = Cast.toNumber(args.ROTATIONS);
        const speed = Cast.toNumber(args.SPEED);

        const params = JSON.stringify({
            motor_no: id,
            command: 'run_for_rotations',
            params: [
                rotations,
                speed,
            ]
        }) + '\n';
        this.motorRunProcess.stdin.write(params);
    }

    motor_run_for_seconds (args)
    {
        const id = Cast.toString(args.ID);
        const seconds = Cast.toNumber(args.SECONDS);
        const speed = Cast.toNumber(args.SPEED);

        const params = JSON.stringify({
            motor_no: id,
            command: 'run_for_seconds',
            params: [
                seconds,
                speed,
            ]
        }) + '\n';
        this.motorRunProcess.stdin.write(params);
    }

    motor_run_to_position (args)
    {
        const id = Cast.toString(args.ID);
        const position = Cast.toNumber(args.POSITION);
        const speed = Cast.toNumber(args.SPEED);

        const params = JSON.stringify({
            motor_no: id,
            command: 'run_to_position',
            params: [
                position,
                speed,
            ]
        }) + '\n';
        this.motorRunProcess.stdin.write(params);
    }

}

module.exports = Scratch3PiBuildHATBlocks;
