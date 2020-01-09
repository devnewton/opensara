<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.2" name="sara" tilewidth="32" tileheight="48" spacing="2" margin="1" tilecount="35" columns="7">
 <image source="sara.png" width="256" height="256"/>
 <tile id="14">
  <properties>
   <property name="name" value="fall"/>
  </properties>
 </tile>
 <tile id="15">
  <properties>
   <property name="name" value="float"/>
  </properties>
 </tile>
 <tile id="16">
  <properties>
   <property name="name" value="jump"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="name" value="stand"/>
  </properties>
  <animation>
   <frame tileid="0" duration="5000"/>
   <frame tileid="7" duration="1000"/>
  </animation>
 </tile>
 <tile id="29">
  <properties>
   <property name="name" value="walk"/>
  </properties>
  <animation>
   <frame tileid="1" duration="500"/>
   <frame tileid="2" duration="500"/>
   <frame tileid="3" duration="500"/>
   <frame tileid="2" duration="500"/>
  </animation>
 </tile>
 <tile id="30">
  <properties>
   <property name="name" value="die"/>
  </properties>
  <animation>
   <frame tileid="8" duration="500"/>
   <frame tileid="9" duration="500"/>
   <frame tileid="10" duration="500"/>
  </animation>
 </tile>
 <tile id="31">
  <properties>
   <property name="name" value="jump"/>
  </properties>
  <animation>
   <frame tileid="18" duration="500"/>
   <frame tileid="17" duration="500"/>
   <frame tileid="19" duration="500"/>
   <frame tileid="20" duration="500"/>
  </animation>
 </tile>
</tileset>
