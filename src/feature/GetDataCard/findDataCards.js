export let findDataCards = (
    data,
    helperData,
    firstFunc,
    firstText,
    firstIcon,
    firstCardColor,
    firstCardbg,
    secondFunc,
    secondText,
    secondIcon,
    secondCardColor,
    secondCardbg,
    thirdFunc,
    thirdText,
    thirdIcon,
    thirdCardColor,
    thirdCardbg,
    forthFunc,
    forthText,
    forthIcon,
    forthCardColor,
    forthCardbg,
  ) => {
    let AllCard = [];
    let first = firstFunc(data);
    let second = secondFunc(data);
    let third = thirdFunc(data);
    let forth = forthFunc(helperData==="without helperdata"? data :helperData);

    AllCard = [
      {
        id: 1,
        title: firstText,
        value: first,
        icon: firstIcon,
        color: firstCardColor,
        bg: firstCardbg,
      },
      {
        id: 2,
        title: secondText,
        value: second,
        icon: secondIcon,
        color: secondCardColor,
        bg: secondCardbg,
      },
      {
        id: 3,
        title: thirdText,
        value: third,
        icon: thirdIcon,
        color: thirdCardColor,
        bg: thirdCardbg,
      },
      {
        id: 4,
        title: forthText,
        value: forth,
        icon: forthIcon,
        color: forthCardColor,
        bg: forthCardbg,
      },
    ];
    return AllCard;
  };