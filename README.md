# adapt-competency-result

**Competency Result** is a *presentation component* to show an average competency rating based on results of an assessment consisting of slider components.  It was based off of [adapt-contrib-assessmentResults](https://github.com/adaptlearning/adapt-contrib-assessmentResults) and adapted for a very specific need.


It is used to display a single assessment's results. It can be used only in conjunction with [adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment) and [adapt-contrib-slider](https://github.com/adaptlearning/adapt-contrib-slider). Feedback and the opportunity to reattempt the assessment may be coordinated with range of ratings. 


## Installation

With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-competency-result`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-competency-result": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* If **Competency Result** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

**Important note: do not put the Component Result component in the same article as the assessment itself**.

The attributes are used in *components.json* to configure **Competency Result**, and are properly formatted as JSON in [*example.json*](https://github.com/LE-sferenchak/adapt-competency-result/blob/master/example.json).


## Limitations
 
This currently only works with the slider component in conjunction with the assessment extension.

----------------------------
**Version number:**  0.0.1
**Framework versions:** 2.1+  
**Author / maintainer:** "Adapted" by Steve Ferenchak of Learning Evolution, LLC from [adapt-contrib-assessmentResults](https://github.com/adaptlearning/adapt-contrib-assessmentResults) by the Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-assessmentResults/graphs/contributors)    
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, IE10, IE9, IE8, IE Mobile 11, Safari 10+11 for macOS+iOS, Opera
