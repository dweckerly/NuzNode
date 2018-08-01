<div id="battle-util">
    <button id="back-util" class="btn btn-outline-secondary">Back</button>
    <div id="mon-select">
        <ul class="list-group list-group-flush">
<?php
include_once("../../includes/db.php");
session_start();
$uid = $_SESSION['uid'];
$sql = "SELECT * FROM ownedMons WHERE uid = '$uid' AND inParty <> 0 ORDER BY inParty";
$q = mysqli_query($conn, $sql);
while($row = mysqli_fetch_assoc($q)) {
?>
            <li data-toggle="collapse" data-target="#mon<?php echo $row['inParty']?>" class="list-group-item nuz-list-item">
                <div class="row">
                    <div class="col-3">
                        <img height="128px" width="128px" src="img/mons/<?php echo $row['img']; ?>">
                    </div>
                    <div class="col-3">
                        <p><?php echo $row['name']; ?></p>
                    </div>
                    <div class="col-3">
                        <p id="<?php echo $row['inParty']?>-hp"><?php echo $row['currentHp']; ?>/<?php echo $row['maxHp']; ?></p>
                    </div>
                    <div class="col-3">
                        <p><?php echo $row['status']; ?></p>
                    </div>
                </div>
                <div id="mon<?php echo $row['inParty']?>" class="collapse">
                <?php
                if($row['alive'] == 1) {
                    ?>
                    <button data="<?php echo $row['inParty']?>" class="btn btn-secondary switch-mon-btn">Switch</button>
                    <?php
                    
                } else {

                }
                ?>
                </div>
            </li>
<?php
}
?>
        </ul>
    </div>
    <div id="item-select">
        <ul class="list-group">
<?php
$sql = "SELECT * FROM ownedItems WHERE uid = '$uid'";
$q = mysqli_query($conn, $sql);
while($row = mysqli_fetch_assoc($q)) {
    $iid = $row['iid'];
    $sql = "SELECT * FROM items WHERE id = '$iid'";
    $iq = mysqli_query($conn, $sql);
    $item = mysqli_fetch_assoc($iq);
    if($item['battle'] == 1) {
?>
            <li class="list-group-item">
                <div class="row">
                    <div class="col-3">
                        <img height="64px" width="64px" src="img/items/<?php echo $item['img']; ?>">
                    </div>
                    <div class="col-3">
                        <p><?php echo $item['name']; ?></p>
                    </div>
                    <div class="col-3">
                        <p><?php echo $row['quantity']; ?></p>
                    </div>
                    <div class="col-3">
                        <button class="btn btn-secondary item-btn" id="item-<?php echo $row['id']; ?>" data="<?php echo $row['id']; ?>" data-effect="<?php echo $item['effect']; ?>" data-name="<?php echo $item['name']; ?>">Use</button>
                    </div>
                </div>
            </li>
<?php
    }
}
?>
        </ul>
    </div>
    <script src="components/battleUtil/battleUtil.js"></script>
</div>
