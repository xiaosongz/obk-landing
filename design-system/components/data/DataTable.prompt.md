Reporting table (acquisition directory, financial lines). Money columns get align:"right".

```jsx
<DataTable columns={[{key:"measure",title:"Financial measure"},{key:"ttm",title:"Trailing 12 months",align:"right"}]} rows={[{id:1,measure:"Effective gross income (EGI)",ttm:"$13,200"}]} footer="Potential rent: $13,800 / Collection rate: 95.7%" />
```