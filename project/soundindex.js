// more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/_q8lY1fY/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }
    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
       for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            var index = getMax(result.scores);

             if((classLabels[index]=="equipo")&&(result.scores[index]>0.90)){
                    window.location.href = 'team.html';
             }else  if((classLabels[index]=="portada")&&(result.scores[index]>0.90)){
             		window.location.href = 'index.html';
             }else  if((classLabels[index]=="abajo")&&(result.scores[index]>0.90)){
             		window.location.href = 'index.html#myfooter';
             }
             else  if((classLabels[index]=="arriba")&&(result.scores[index]>0.90)){
             		window.location.href = 'index.html#title-screen';
             }
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }
    function getMax(resultArray){
        var max=0;
        var index=0;
        for(let i=0;i<resultArray.length;i++){
            if(resultArray[i]>max){
                max=resultArray[i];
                index=i;
            }
        }
        return index;
    }