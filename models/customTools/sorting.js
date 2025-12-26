const exportFunction = module.exports = {};


exportFunction.filterStylistBySearch = (allStylist, searchString) =>{
    fullMatch = searchString;
    searchString = Array.from(searchString);
    let findScoreAll = [];
    let findScoreFiltered = [];
    let found = [];

    //Search for match
    let i = 0;
    while(i < allStylist.length){
        findScoreAll[i] = 0;        
        let x =0;
        while(x < searchString.length){
            regEx = new RegExp(`[${searchString[x]}]`);

            firstNameMatch = testSearch(regEx, allStylist[i].firstName);
            firstNameFullMatch = testFullMatch(fullMatch, allStylist[i].firstName);

            lastNameMatch = testSearch(regEx, allStylist[i].lastName);
            lastNameFullMatch = testFullMatch(fullMatch, allStylist[i].lastName);

            businessNameMatch = testSearch(regEx, allStylist[i].businessName);
            businessNameFullMatch = testFullMatch(fullMatch, allStylist[i].businessName);

            stateMatch = testSearch(regEx, allStylist[i].state);
            stateFullMatch = testFullMatch(fullMatch, allStylist[i].state);

            cityMatch = testSearch(regEx, allStylist[i].city);
            cityFullMatch = testFullMatch(fullMatch, allStylist[i].firstName);

            if(firstNameMatch === true){
                findScoreAll[i]++;
            }
            if(firstNameFullMatch === true){
                scoreWeight = fullMatch.length * 3;
                findScoreAll[i] += scoreWeight;
            }


            if(lastNameMatch === true){
                findScoreAll[i]++;
            }
            if(lastNameFullMatch === true){
                scoreWeight = fullMatch.length * 3;
                findScoreAll[i] += scoreWeight;
            }


            if(businessNameMatch === true){
                findScoreAll[i]++;
            }
            if(businessNameFullMatch === true){
                scoreWeight = fullMatch.length * 2;
                findScoreAll[i] += scoreWeight;
            }


            if(stateMatch === true){
                findScoreAll[i]++;
            } 
            if(stateFullMatch === true){
                scoreWeight = fullMatch.length * 1.2;
                findScoreAll[i] += scoreWeight;
            } 


            if(cityMatch === true){
                findScoreAll[i]++;
            } 
            if(cityFullMatch === true){
                scoreWeight = fullMatch.length * 1.5;
                findScoreAll[i] += scoreWeight;
            } 
            x++;
        }
        i++;
    } 

    i = 0;
    foundCounter = 0;
    while(i < allStylist.length){ //Filter stylist before sorting
        if(findScoreAll[i] !== 0){
            findScoreFiltered[foundCounter] = findScoreAll[i];
            found[foundCounter] = allStylist[i];
            foundCounter++;
        }
        i++
    }

    sortedStylistList = stylistSort(findScoreFiltered, found);

    return sortedStylistList;

}


function stylistSort(scores, orginalStylistList){
    
    numberOfStylist = orginalStylistList.length;
    if(numberOfStylist > 1){
        evenNumber = numberOfStylist % 2;
        if(evenNumber === 0){
            splitPoint = numberOfStylist / 2;
        }
        else{
            splitPoint = ((numberOfStylist - 1) / 2) ;
        }
    }
    else{
        return orginalStylistList;
    }
      
    if(splitPoint === 1){//If there are only two matches then sort without the split or merge
        listSorted = listSortByScore(orginalStylistList, scores);
        return listSorted.stylistList;
    }
    else{
        //Split stylist list
        stylistListOne = orginalStylistList.slice(0, splitPoint);
        stylistListTwo = orginalStylistList.slice(splitPoint, numberOfStylist);

        //Splist scores list
        scoresListOne = scores.slice(0, splitPoint);
        scoresListTwo = scores.slice(splitPoint, numberOfStylist);
            
        //Find split sort
        firstListSorted = listSortByScore(stylistListOne, scoresListOne);
        secondListSorted = listSortByScore(stylistListTwo, scoresListTwo);

        //Merge and sort List 
        let i =0;
        let x =0;
        let stylistList = [];
        let scoresList = [];
        while(i < numberOfStylist){
            if(i < firstListSorted.stylistList.length){
                stylistList[i] = firstListSorted.stylistList[i];
                scoresList[i] = firstListSorted.scoresList[i];
            }
            else{
                stylistList[i] = secondListSorted.stylistList[x];
                scoresList[i] = secondListSorted.scoresList[x];
                x++
            }
            i++;
        }

        //Then re-sort
        finalListSorted = listSortByScore(stylistList, scoresList);
        return finalListSorted.stylistList;
    }
        

    
}


function listSortByScore(stylistList, scoresList){
    let x =0;
    while(x < stylistList.length){
        let i = 0;
        let lastScore = 0;
        while(i < stylistList.length){
            if(lastScore < scoresList[i] && i !== 0){
                    
                lastScore = scoresList[i];
                    
                tempScore = scoresList[i - 1];
                scoresList[i - 1] = scoresList[i];
                scoresList[i] = tempScore;
                    
                tempStylist = stylistList[i - 1];
                stylistList[i - 1] = stylistList[i];
                stylistList[i] = tempStylist;
                    
            }
            else if(i !== 0){
                lastScore = scoresList[i];
            }
            else{
                lastScore = scoresList[0];
            }
            i++;

        }
        x++;
    }

    return {
        stylistList,
        scoresList
    };
}


function testSearch(regEx, string){
    matchCaps = regEx.test(string.toUpperCase());
    matchLower = regEx.test(string.toLowerCase());
    if(matchCaps === true || matchLower === true){
        match = true;
    }
    else{
        match = false;
    }
    return match;
}


function testFullMatch(testString, stylistProp){
    if(testString.toLowerCase() === stylistProp.toLowerCase()){
        return true;
    }
    else{
        return false;
    }
}