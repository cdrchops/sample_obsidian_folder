---
title: Drugs Index
dateCreated: 26Jul24T11:51:49
dateModified: 26Jul24T12:56:59
---

```dataview
TABLE WITHOUT ID title as "Title", Generic as "Trade Name", Class, Action, Indications, AdverseEffects as "Adverse Effects", Contraindications, SpecialConsiderations as "Special Considerations", PregnancyClass as "Pregnancy Class", Adults, Pediatrics

FROM #tmpMeds
SORT title
```
