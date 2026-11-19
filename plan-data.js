// Demo fixtures only. Replace geometry, records and status together with client material.
window.planData = {
  quarters: [
    { id:'nk', name:'Nikolo-Korma', description:'Plots for individual housing in the village of Nikolo-Korma, with year-round access. Areas according to the project materials are 9–20 sotkas. Check the position relative to the school, shop and neighbouring houses for the chosen plot.', price:'from 45,000 RUB per sotka', bounds:[40,100,270,310] },
    { id:'dg', name:'Degtyaritsy', description:'Plots for individual housing beside residential houses, near the pine forest and the Volga. The project website lists areas of 11–25 sotkas.', price:'from 70,000 RUB per sotka', bounds:[630,100,230,310] },
    { id:'ct', name:'Central area', description:'Plots of 6.5–19.5 sotkas near Vysokovsky Bor camp connect Degtyaritsy and Nikolo-Korma. According to this neighbourhood’s page, the asphalt road is 30 metres away; the plots are level and prepared for construction. The condition of the chosen plot and the necessary preparation work are clarified during a viewing.', price:'Price to be confirmed', bounds:[335,100,270,310] }
  ],
  plots: [
    {id:'ДЕМО-01',quarter:'nk',area:10,status:'free',pricePerSotka:null,total:null,rect:[70,175,90,85]},
    {id:'ДЕМО-02',quarter:'nk',area:12,status:'free',pricePerSotka:null,total:null,rect:[185,175,90,85]},
    {id:'ДЕМО-03',quarter:'nk',area:14,status:'sold',pricePerSotka:null,total:null,rect:[70,285,205,80]},
    {id:'ДЕМО-04',quarter:'dg',area:15,status:'free',pricePerSotka:null,total:null,rect:[660,175,170,85]},
    {id:'ДЕМО-05',quarter:'dg',area:11,status:'sold',pricePerSotka:null,total:null,rect:[660,285,170,80]},
    {id:'ДЕМО-06',quarter:'ct',area:16,status:'sold',pricePerSotka:null,total:null,rect:[365,175,205,190]}
  ]
};
