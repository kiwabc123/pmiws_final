const router = require("express").Router();
const { check } = require("express-validator");
const service = require("../../services/accounts/admin");
const { authenticated,authenticatedAdmin,password_hash,generateAccessToken,authenticateToken } = require("../../configs/security");

// router.get('/getUserAll', [], async(req, res) => {
//     try {
//         const items = await service.findAll()
//         //console.log(items)
//         res.json(items)
//     } catch (err) {
//         res.error(err)
//     }
// })

// router.post("/addUpdate", [check("username").not().isEmpty(), check("password").not().isEmpty()],
//     async (req, res) => {
//         try {
//             req.validate();
//             // const created = await service.onRegister(req.body);
//             // res.json(created);
//             const item = await service.findOne(req.body);

//             if (item === null) {
//                     res.json({ message: await service.onRegister(req.body) })
//                 } else {
//                     res.json({ message: await service.onUpdate(req.body) })
//                 }
//         } catch (err) {
//             res.error(err);
//         }
//     }
// );

// router.post("/register", [check("username").not().isEmpty(), check("password").not().isEmpty()],
//     async (req, res) => {
//         try {
//             req.validate();
//             const created = await service.onRegister(req.body);
//             res.json(created);
//         } catch (err) {
//             res.error(err);
//         }
//     }
// );

// router.post("/getUserLogin", authenticated, (req, res) => {
//     try {
//         res.json(req.session.user);
//     } catch (err) {
//         res.error(err, 401);
//     }
// });

router.post("/getAdminLogin", authenticateToken, (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.error(err, 401);
    }
});

router.post("/login", [check("username").not().isEmpty(), check("password").not().isEmpty()],
    async (req, res) => {
        try {
            req.validate();
            const created = await service.onLogin(req);
            // req.session.userAdmin = created;
            let token = generateAccessToken(created);
            // console.log(created)
            res.json({user : created,token : token});
        } catch (err) {
            res.error(err);
        }
    }
);

// router.post("/loginUser", [check("username").not().isEmpty(), check("password").not().isEmpty()],
//     async (req, res) => {
//         try {
//             req.validate();
//             const created = await service.onLogin(req);
//             req.session.user = created;
//             res.json(created);
//         } catch (err) {
//             res.error(err);
//         }
//     }
// );

router.post("/logout", (req, res) => {
    try {
        delete req.session.userAdmin;
        res.json({ message: "logout" });
    } catch (err) {
        res.error(err);
    }
});

// router.post("/logoutUser", (req, res) => {
//     try {
//         delete req.session.user;
//         res.json({ message: "logout" });
//     } catch (err) {
//         res.error(err);
//     }
// });

module.exports = router;
