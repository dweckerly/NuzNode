<div id="battle-header">
<?php
include_once("../../includes/db.php");
$id = $_POST['id'];
$type = $_POST['type'];
$locId = $_POST['locId'];
$oAi = $_POST['oAi'];
if(is_null($oAi)) {
    $oAi = "random";
}
?>
<script>
    var locId = <?php echo $locId; ?>;
    var type = "<?php echo $type; ?>";
    var opponentAI = "<?php echo $oAi; ?>";

    var playerMons = {
<?php
session_start();
$uid = $_SESSION['uid'];
$sql = "SELECT * FROM ownedMons WHERE uid = '$uid' AND inParty > 0 ORDER BY inParty";
$query = mysqli_query($conn, $sql);
while($rows = mysqli_fetch_assoc($query)) {
?>
        '<?php echo $rows['inParty'];?>': {
            'id': <?php echo $rows['id']; ?>,
            'name': '<?php echo $rows['name']; ?>',
            'img': '<?php echo $rows['img']; ?>',
            'type1': '<?php echo $rows['type1']; ?>',
            'type2': '<?php echo $rows['type2']; ?>',
            'maxHp': '<?php echo $rows['maxHp']; ?>',
            'currentHp': '<?php echo $rows['currentHp']; ?>',
            'atk': '<?php echo $rows['atk']; ?>',
            'def': '<?php echo $rows['def']; ?>',
            'sAtk': '<?php echo $rows['sAtk']; ?>',
            'sDef': '<?php echo $rows['sDef']; ?>',
            'speed': '<?php echo $rows['speed']; ?>',
            'status': '<?php echo $rows['status']; ?>',
            'perk1': '<?php echo $rows['perk1']; ?>',
            'perk2': '<?php echo $rows['perk2']; ?>',
            'alive': '<?php echo $rows['alive']; ?>',
            'moves': {
                <?php
    $atk1 = $rows['move1'];
    $atk2 = $rows['move2'];
    $atk3 = $rows['move3'];
    $atk4 = $rows['move4'];
    $sql = "SELECT * FROM moves WHERE id = '$atk1' OR id = '$atk2' OR id = '$atk3' OR id = '$atk4'";
    $result = mysqli_query($conn, $sql);
    $i = 1;
    while($aRow = mysqli_fetch_assoc($result)) {
                ?>
                '<?php echo $i; ?>': {
                    'id': '<?php echo $aRow['id']; ?>',
                    'name': '<?php echo $aRow['name']; ?>',
                    'dmg': '<?php echo $aRow['dmg']; ?>',
                    'acc': '<?php echo $aRow['acc']; ?>',
                    'crit': '<?php echo $aRow['crit']; ?>',
                    'type': '<?php echo $aRow['type']; ?>',
                    'special': '<?php echo $aRow['special']; ?>',
                    'contact': '<?php echo $aRow['contact']; ?>',
                    'e1': '<?php echo $aRow['effect1']; ?>',
                    'e2': '<?php echo $aRow['effect2']; ?>',
                    'e3': '<?php echo $aRow['effect3']; ?>',
                    'anim': '<?php echo $aRow['anim']; ?>'
                },
<?php
        $i++;
        
    }
?>
            },
            'exp' : <?php echo $rows['exp']; ?>,
            'level': <?php echo $rows['level']; ?>
        },
<?php
}
?>
    };
    var opponentMons = {
<?php
if($type == 'wild') {
    $sql = "SELECT * FROM mons WHERE id = '$id'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    
    $mid = $row['id'];
    $name = $row['name'];
    $img = $row['img'];
    $type1 = $row['type1'];
    $type2 = $row['type2'];

    $hpMod = rand(0, 20) - 10;
    $atkMod = rand(0, 20) - 10;
    $defMod = rand(0, 20) - 10;
    $sAtkMod = rand(0, 20) - 10;
    $sDefMod = rand(0, 20) - 10;
    $speedMod = rand(0, 20) - 10;

    $maxHp = $hpMod + $row['hp'];
    $currentHp = $hpMod + $row['hp'];
    $atk = $atkMod + $row['atk'];
    $def = $defMod + $row['def'];
    $sAtk = $sAtkMod + $row['sAtk'];
    $sDef = $sDefMod + $row['sDef'];
    $speed = $speedMod + $row['speed'];

    $modAvg = round(($hpMod + $atkMod + $defMod + $sAtkMod + $sDefMod + $speedMod) / 6, 2);
    if($modAvg < -5){
        $potential = "Terrible";
    } else if($modAvg < 0) {
        $potential = "Poor";
    } else if($modAvg < 5) {
        $potential = "Decent";
    } else if($modAvg < 10) {
        $potential = "Excellent";
    } else if($modAvg >= 10) {
        $potential = "Legendary";
    }
    
    $movePool = $row['movePool'];
    $sql = "SELECT * FROM movePools WHERE id = '$movePool'";
    $res = mysqli_query($conn, $sql);
    $moveIds = mysqli_fetch_assoc($res);

    $moveId1 = $moveIds['moveId1'];
    $moveId2 = $moveIds['moveId2'];

    $sql = "SELECT * FROM moves WHERE id = '$moveId1'";
    $q = mysqli_query($conn, $sql);
    $move1 = mysqli_fetch_assoc($q);

    $sql = "SELECT * FROM moves WHERE id = '$moveId2'";
    $q = mysqli_query($conn, $sql);
    $move2 = mysqli_fetch_assoc($q);
?>
        '1' : {
            'id': '<?php echo $mid; ?>',
            'name': '<?php echo $name; ?>',
            'img': '<?php echo $img; ?>',
            'type1': '<?php echo $type1; ?>',
            'type2': '<?php echo $type2; ?>',
            'maxHp': '<?php echo $maxHp; ?>',
            'currentHp': '<?php echo $currentHp; ?>',
            'atk': '<?php echo $atk; ?>',
            'def': '<?php echo $def; ?>',
            'sAtk': '<?php echo $sAtk; ?>',
            'sDef': '<?php echo $sDef; ?>',
            'speed': '<?php echo $speed; ?>',
            'status': '',
            'perk1': '',
            'perk2': '',
            'alive': 1,
            'moves': {
                '1': {
                    'id': '<?php echo $move1['id']; ?>',
                    'name': '<?php echo $move1['name']; ?>',
                    'dmg': '<?php echo $move1['dmg']; ?>',
                    'acc': '<?php echo $move1['acc']; ?>',
                    'crit': '<?php echo $move1['crit']; ?>',
                    'type': '<?php echo $move1['type']; ?>',
                    'special': '<?php echo $move1['special']; ?>',
                    'contact': '<?php echo $move1['contact']; ?>',
                    'e1': '<?php echo $move1['effect1']; ?>',
                    'e2': '<?php echo $move1['effect2']; ?>',
                    'e3': '<?php echo $move1['effect3']; ?>',
                    'anim': '<?php echo $move1['anim']; ?>'
                },
                '2': {
                    'id': '<?php echo $move2['id']; ?>',
                    'name': '<?php echo $move2['name']; ?>',
                    'dmg': '<?php echo $move2['dmg']; ?>',
                    'acc': '<?php echo $move2['acc']; ?>',
                    'crit': '<?php echo $move2['crit']; ?>',
                    'type': '<?php echo $move2['type']; ?>',
                    'special': '<?php echo $move2['special']; ?>',
                    'contact': '<?php echo $move2['contact']; ?>',
                    'e1': '<?php echo $move2['effect1']; ?>',
                    'e2': '<?php echo $move2['effect2']; ?>',
                    'e3': '<?php echo $move2['effect3']; ?>',
                    'anim': '<?php echo $move2['anim']; ?>'
                }
            },
            'potential': '<?php echo $potential; ?>'
        }
    };
<?php
} else if($type == 'npc') {
    // would use this to query npc mons
}
?>
    </script>
    <div id="top-bar">
        <p id="battle-marque"></p>
    </div>
</div>
