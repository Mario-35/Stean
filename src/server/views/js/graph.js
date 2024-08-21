function showGraph(element, infos, value) {
  console.log(infos);
    new Dygraph(
        document.getElementById(element),
        value,
        {
          title: infos[1],
          ylabel: infos[2],
          xlabel: infos[0],
          legend: 'always',
          rollPeriod: 30,
          showRangeSelector: true,
          resizable: "both",
          connectSeparatedPoints: false
        }
    );
}
