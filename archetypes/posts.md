---

title   : "{{ replace .Name "-" " " | title }}"
author  : "__zaika_denis"
date    : {{ .Date }}
draft   : false
postid  : "{{ printf "A.%02d" (add (len .Site.RegularPages) 1) }}"
postdesc: "post short description"
tags    : ["catia", "julia"]

---
