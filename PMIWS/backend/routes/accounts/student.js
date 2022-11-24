const router = require("express").Router();
const { check } = require("express-validator");
const service = require("../../services/accounts/student");
const serviceGroup = require("../../services/groups/group");
//  เพิ่มข้อมูล
router.post(
  "/",
  [check("stuID").not().isEmpty(), check("stuYear").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();
      const item = await service.findOne(req.body);

      if (item === null) {
        res.json({ message: await service.onInsert(req.body) });
      } else {
        res.json({ message: await service.onUpdateData(req.body) });
      }

      // res.json({ message: item })
    } catch (err) {
      res.error(err);
    }
  }
);

router.post(
  "/register",
  [check("stuID").not().isEmpty(), check("stuYear").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();
      const item = await service.findByStudent(req.body);

      item.stuGroup = ""

      if (item === null) {
        res.json({ message: await service.onInsert(req.body) });
      } else {
        res.json({ message: await service.onUpdateStudent(req.body) });
      }

      // res.json({ message: item })
    } catch (err) {
      res.error(err);
    }
  }
);

router.get("/random", [], async (req, res) => {
  try {
    req.validate();

    // ดึงค่าข้อมูลทั้งจำนวนกลุ่มและข้อมูลผู้เข้าร่วม

    var itemGroup = await serviceGroup.findAll();
    var itemStudent = await service.findAll();
    var dataStudent = await addStudents(itemGroup, itemStudent);

    // if (item === null) {
    //         res.json({ message: await service.onInsert(req.body) })
    //     } else {
    //         res.json({ message: await service.onUpdateStudent(req.body) })
    //     }

    res.json(dataStudent);
  } catch (err) {
    res.error(err);
  }
});

router.get("/", [], async (req, res) => {
  try {
    const items = await service.findAll();
    //console.log(items)
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.get("/Grouplength", [], async (req, res) => {
  try {
    const items = await service.findGroupLength();
    //console.log(items)
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.get("/Yearlength", [], async (req, res) => {
  try {
    const items = await service.findYearLength();
    //console.log(items)
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.get("/byID", [], async (req, res) => {
  try {
    const items = await service.findOne(req.params.id);
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});
router.get("/byGroup", [], async (req, res) => {
  try {
    const items = await service.findByGroup(req.query.group);
    res.json(items);
  } catch (err) {
    res.error(err);
  }
});

router.put(
  "/update",
  [
    check("stuGroup").not().isEmpty(),
    check("stuID").not().isEmpty(),
    check("stuYear").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      req.validate();
      const updateItem = await service.onUpdateData(req.body);
      res.json(updateItem);
    } catch (err) {
      res.error(err);
    }
  }
);

router.delete("/", async (req, res) => {
  // console.log(req.query)
  try {
    const item = await service.findOne(req.query);
    console.log(item)
    if (!item) {
      throw new Error("Not found item.");
    } else {
      const deleteItem = await service.onDelete(item);
      // console.log("complete")
      res.json(deleteItem);
    }
  } catch (err) {
    res.error(err);
  }
});

async function addStudents(val, val2, data) {
    // ชี้แจ้งนะ ตัวระบบสุ่มพี่คิดโลจิกไว้ค่อนข้างเยอะที่มีการ Comment ไว้คือโลจิกที่มีความเป็นไปได้ทั้งหมด ทั้งนี้ถ้าคิดจะเปลี่ยนโลจิกจากเดิม ให้ศึกษาก่อนนะ
    // ที่ใช้อยู่ตอนนี้เป็นแบบหารตามจำนวนที่เท่าๆกัน ตามจำนวนเด็ก ในเคสที่ทดสอบเด็ก 81 คน แยกปี 1 38 คน ปี 2 27 คน ปี 3 16 คน นะ


//   var studentGroupArray = val;

    // เซทข้อมูลผู้เข้าร่วม 
    var studentIDArray = val2;

//   var studentGroupLength = studentGroupArray.length;
//   var studentIDLength = studentIDArray.length;

// ส่วนนี้เป็นการหาจำนวนเฉลี่ยเพื่อแบ่งกลุ่ม โดยนำจำนวนเด็กมาหารจำนวนกลุ่มเพื่อหากลุ่มที่มีมากที่สุด

//   var avgLength = Math.ceil(studentIDLength / studentGroupLength);

// Random จำนวนกลุ่มในการเซ็ทข้อมูล (จะมีอีกตัวสำหรับไว้สุ่ม Index ของเด็กผู้จะเซทค่าของเด็กที่ได้ในแต่ละกลุ่ม)

//   var randomGroup = Math.floor(Math.random() * studentGroupLength);

    // กำหนดค่าเปล่าไว้ในตัวแปร Group พี่คิดได้เท่านี้ 555 โดยจะเป็น Array เปล่า 10 กลุ่ม ถ้าเพิ่มหรือลดต้องปรับตรงนี้ด้วย และนำจุดนี้ไปแสดงผลโดย เพื่อจะได้ไม่ต้องเรียกตัวแปรไว้โชว์แยก (กรณีทำเทส)

  var group = [[], [], [], [], [], [], [], [], [], []];

  // let shuffled = studentIDArray
  // .map(value => ({ value, sort: Math.random() }))
  // .sort((a, b) => a.sort - b.sort)
  // .map(({ value }) => value)

  // let forLength = shuffled.length

//   หาจำนวนเด็กแต่ละชั้นปี

  var studentYear1Length = studentIDArray.filter(
    (x) => x.stuYear === "ปี 1"
  ).length;
  var studentYear2Length = studentIDArray.filter(
    (x) => x.stuYear === "ปี 2"
  ).length;
  var studentYear3Length = studentIDArray.filter(
    (x) => x.stuYear === "ปี 3"
  ).length;

//   สุ่มรายชื่อเด็กแต่ละชั้นปี เพื่อให้รายชื่อไม่เรียงกัน (กรณีมาไอดีติดๆกันจะได้กระจายได้มากที่สุด)

  var studentYear1 = studentIDArray
    .filter((x, ia) => x.stuYear === "ปี 1")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  var studentYear2 = studentIDArray
    .filter((x, ib) => x.stuYear === "ปี 2")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  var studentYear3 = studentIDArray
    .filter((x, ic) => x.stuYear === "ปี 3")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

//   var avgLength1 = Math.round(studentYear1Length / studentGroupLength);
//   var avgLength2 = Math.round(studentYear2Length / studentGroupLength);
//   var avgLength3 = Math.round(studentYear3Length / studentGroupLength);

    // ตัวเต็งของงาน โดยหลักคือเอาจำนวนแต่ละชั้นปี หารโดยจำนวนที่น้องต้องหาค่าที่ลงตัวมากที่สุด และพอได้จำนวนมาปัดเศษตกไปให้เหลือแค่จำนวนเต็ม จากนั้นนำมา คูณ กับตัวเลขที่ต้องหาให้ตรง
    // ตัวอย่าง เด็กปี 1 38 คน หาร 14 ได้ 2.7xxx ปัดเหลือ 2 คูณ 15 เป็น 30

  // var studentYear1LengthFixed = Math.floor(studentYear1Length / 16) * 15;
  // var studentYear2LengthFixed = Math.floor(studentYear2Length / 13) * 13;
  // var studentYear3LengthFixed = Math.floor(studentYear3Length / 13) * 13;

  var studentYear1LengthFixed = 20;
  var studentYear2LengthFixed = 22;
  var studentYear3LengthFixed = 10;
  

  // console.log(studentYear1)
  console.log("studentYear1 ", studentYear1Length);
  console.log("studentYear2 ", studentYear2Length);
  console.log("studentYear3 ", studentYear3Length);

    // เซทค่ารันลงกลุ่ม โดย runNum เป็นเลขของกลุ่มตาม Index โดยเป็นเลขน้อยสุด และ runNum(x)_(x) คือ จำนวนกลุ่มเหมือนกัน แต่จะเซทค่ามากที่สุดของกลุ่มตาม Index

  let runNum1 = 0;
  let runNum1_1 = 9;
//   let Limit1 = 0;
  let runNum2 = 0;
  let runNum2_1 = 9;
//   let Limit2 = 0;
  let runNum3 = 0;
//   let Limit3 = 0;
  let runNum3_1 = 9;

//   อันนี้ลูปข้อมูลเหมือนแบบที่ใช้อยู่ แต่การทำแบบนี้จะได้จำนวนที่ไม่เท่ากันอยู่ดี
// เช่น พอลูปแล้ว จำนวนกลุ่มเด็ก 1-6 เป็น 9 คนและที่เหลือจะได้ไม่เท่ากัน กลุ่มที่ได้น้อยสุดจะเป็น 10 ซึ่งได้ 5 คน
// ถ้าจำนวนคนเท่ากันกับจำนวนกลุ่มและหารลงตัวสามารถใช้วิธีนี้ได้ แต่ยังไม่ก็ไม่แนะนำนะ

  // for(var aa = 0; aa < studentYear1.length; aa++){

  //         if(runNum1 == 10){
  //             runNum1 = 0
  //         }

  //         group[runNum1].push({
  //             stuGroup : runNum1 + 1,
  //             stuID : studentYear1[aa].stuID,
  //             stuYear :  studentYear1[aa].stuYear,
  //        })

  //        runNum1 = runNum1 + 1;
  // }

  // for(var bb = 0; bb < studentYear2.length; bb++){
  //     if(runNum2 == 10){
  //         runNum2 = 0
  //     }

  //     group[runNum2].push({
  //         stuGroup : runNum2 + 1,
  //         stuID : studentYear2[bb].stuID,
  //         stuYear :  studentYear2[bb].stuYear,
  //    })

  //    runNum2 = runNum2 + 1;

  // }

  // for(var cc = 0; cc < studentYear3.length; cc++){
  //     if(runNum3 == 10){
  //         runNum3 = 0
  //     }

  //     group[runNum3].push({
  //         stuGroup : runNum3 + 1,
  //         stuID : studentYear3[cc].stuID,
  //         stuYear :  studentYear3[cc].stuYear,
  //    })

  //    runNum3 = runNum3 + 1;

  // }

//   ลูปข้อมูลเด็กแต่ละปีเข้ากลุ่ม และอัพเดทเข้าตาราง
// โดยในการลูปจะลูปจาก 0 ไปจำนวนที่หารที่ในคราวก่อน

  for (var aa = 0; aa < studentYear1LengthFixed; aa++) {
    // ทำดักไว้กรณีกลุ่มเกิน ในส่วนนี้ 10 คือกลุ่มที่ 11 แต่เราเซทมี 10 กลุ่ม Index ต้องเป็น 9 ดังนั้น ถ้าถึง 10 ต้องปัดไปเป็น 0 คือเริ่มที่กลุ่ม 1 ใหม่
    if (runNum1 == 10) {
      runNum1 = 0;
    }

    group[runNum1].push({
      stuGroup: runNum1 + 1,
      stuID: studentYear1[aa].stuID,
      stuYear: studentYear1[aa].stuYear,
    });

    await service.onUpdateStudent({
        stuGroup: runNum1 + 1,
        stuID: studentYear1[aa].stuID,
        stuYear: studentYear1[aa].stuYear,
      })

    // เพิ่มเลขเข้าไปเพื่อไปกลุ่มต่อไป
    runNum1 = runNum1 + 1;

    //    studentYear1.splice(aa,1)
  }

  for (var bb = 0; bb < studentYear2LengthFixed; bb++) {
    if (runNum2 == 10) {
      runNum2 = 0;
    }

    group[runNum2].push({
      stuGroup: runNum2 + 1,
      stuID: studentYear2[bb].stuID,
      stuYear: studentYear2[bb].stuYear,
    });

    await service.onUpdateStudent({
        stuGroup: runNum2 + 1,
        stuID: studentYear2[bb].stuID,
        stuYear: studentYear2[bb].stuYear,
      })

    runNum2 = runNum2 + 1;

    // studentYear2.splice(bb,1)
  }

  for (var cc = 0; cc < studentYear3LengthFixed; cc++) {
    if (runNum3 == 10) {
      runNum3 = 0;
    }

    group[runNum3].push({
      stuGroup: runNum3 + 1,
      stuID: studentYear3[cc].stuID,
      stuYear: studentYear3[cc].stuYear,
    });

    await service.onUpdateStudent({
        stuGroup: runNum3 + 1,
        stuID: studentYear3[cc].stuID,
        stuYear: studentYear3[cc].stuYear,
      })

    runNum3 = runNum3 + 1;

    // studentYear3.splice(cc,1)
  }

//   และในตรงนี้เป็นการลูปข้อมูลจากจำนวนที่หารถึงจำนวนเด็กที่เหลือ



  for (var aa = studentYear1LengthFixed; aa < studentYear1.length; aa++) {
    if (runNum1_1 == 0) {
      runNum1_1 = 9;
    }

    group[runNum1_1].push({
      stuGroup: runNum1_1 + 1,
      stuID: studentYear1[aa].stuID,
      stuYear: studentYear1[aa].stuYear,
    });

    await service.onUpdateStudent({
        stuGroup: runNum1_1 + 1,
        stuID: studentYear1[aa].stuID,
        stuYear: studentYear1[aa].stuYear,
      })

    runNum1_1 = runNum1_1 - 1;

    //    studentYear1.splice(aa,1)
  }

  for (var bb = studentYear2LengthFixed; bb < studentYear2.length; bb++) {
    if (runNum2_1 == 0) {
        runNum2_1 = 9;
    }

    group[runNum2_1].push({
      stuGroup: runNum2_1 + 1,
      stuID: studentYear2[bb].stuID,
      stuYear: studentYear2[bb].stuYear,
    });

    await service.onUpdateStudent({
        stuGroup: runNum2_1 + 1,
        stuID: studentYear2[bb].stuID,
        stuYear: studentYear2[bb].stuYear,
      })

    runNum2_1 = runNum2_1 - 1;

    // studentYear2.splice(bb,1)
  }

  for (var cc = studentYear3LengthFixed; cc < studentYear3.length; cc++) {
    if (runNum3_1 == 0) {
        runNum3_1 = 9;
    }

    group[runNum3_1].push({
      stuGroup: runNum3_1 + 1,
      stuID: studentYear3[cc].stuID,
      stuYear: studentYear3[cc].stuYear,
    });

    await service.onUpdateStudent(
        {
            stuGroup: runNum3_1 + 1,
            stuID: studentYear3[cc].stuID,
            stuYear: studentYear3[cc].stuYear,
          }
    )

    runNum3_1 = runNum3_1 - 1;

    // studentYear3.splice(cc,1)
  }

//   อันนี้เป็นกรณีสุ่มกลุ่มแล้วล็อคตำแหน่งแต่ละชั้นปีว่าน้องจะได้อยู่กลุ่มไหน

  // for (var i = 0; i < forLength; i++) {
  //     if(group[randomGroup].length === avgLength){
  //         var index1_4 = studentGroupArray.map((x) => x.GroupNo).indexOf(randomGroup.toString())

  //         studentGroupArray.splice(index1_4,1)
  //         randomGroup = Math.floor(Math.random() * studentGroupArray.length)
  //     }

  //     switch (shuffled[i].stuYear) {
  //         case "ปี 1":
  //             var index1_3 = group.filter((x) => x.stuYear === "ปี 1").length

  //             if(group[randomGroup].length < avgLength && index1_3 <= avgLength1){
  //                 group[randomGroup].push({
  //                     stuGroup : randomGroup + 1,
  //                     stuID : shuffled[i].stuID,
  //                     stuYear :  shuffled[i].stuYear,
  //                 })
  //                 randomGroup = Math.floor(Math.random() * studentGroupArray.length)
  //             }
  //             break;
  //         case "ปี 2":
  //             var index2_3 = group.filter((x) => x.stuYear === "ปี 2").length

  //             if(group[randomGroup].length < avgLength && index2_3 <= avgLength2){
  //                 group[randomGroup].push({
  //                     stuGroup : randomGroup + 1,
  //                     stuID : shuffled[i].stuID,
  //                     stuYear :  shuffled[i].stuYear,
  //                 })
  //                 randomGroup = Math.floor(Math.random() * studentGroupArray.length)
  //             }
  //             break;
  //         case "ปี 3":
  //             var index3_3 = group.filter((x) => x.stuYear === "ปี 3").length

  //             if(group[randomGroup].length < avgLength && index3_3 <= avgLength3){
  //                 group[randomGroup].push({
  //                     stuGroup : randomGroup + 1,
  //                     stuID : shuffled[i].stuID,
  //                     stuYear :  shuffled[i].stuYear,
  //                 })
  //                 randomGroup = Math.floor(Math.random() * studentGroupArray.length)
  //             }
  //             break;
  //         default:
  //             break;
  //     }

  // }

//   อันนี้เป็นสุ่มทั้งกลุ่มและสุ่มเด็กที่จะได้กลุ่มนั้นๆ

  // for(var x = 0;x<forLength;x++){
  //     var groupIndex = group.map((x) => x.stuGroup).indexOf(randomGroup)
  //     // console.log(groupIndex)

  //     if(groupIndex <= avgLength + 1){
  //         var index1_1 = studentIDArray.map((x) => x.stuID).indexOf(studentIDArray[randomStudent].stuID)
  //         group[randomGroup] = {
  //             stuGroup : randomGroup + 1,
  //             stuID : studentIDArray[randomStudent].stuID
  //         }
  //         studentIDArray.splice(index1_1,1)

  //         studentIDLength = studentIDArray.length
  //     }

  //     if(groupIndex === avgLength + 1){
  //         var index1_2 = studentGroupArray.map((x) => x.GroupNo).indexOf(randomGroup.toString())
  //         studentGroupArray.splice(index1_2,1)
  //         studentGroupLength = studentGroupArray.length
  //     }

  //     randomGroup = Math.floor(Math.random() * studentGroupLength)
  //     randomStudent = Math.floor(Math.random() * studentIDLength)
  // }

  console.log("Group 1", group[0].length);
  console.log("Group 2", group[1].length);
  console.log("Group 3", group[2].length);
  console.log("Group 4", group[3].length);
  console.log("Group 5", group[4].length);
  console.log("Group 6", group[5].length);
  console.log("Group 7", group[6].length);
  console.log("Group 8", group[7].length);
  console.log("Group 9", group[8].length);
  console.log("Group 10", group[9].length);

  // console.log("Student ",studentIDLength)
  // console.log("Group ",studentGroupLength)
  // console.log("randomGroup",randomGroup)
  // console.log("randomStudent",randomStudent)

  // console.log(group)

//   Return ค่าที่สุ่มเด็กได้กลับไปแสดงผล

  return group;
}

module.exports = router;
